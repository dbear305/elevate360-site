#!/usr/bin/env bash
set -Eeuo pipefail
# Read only nonsecret settings; never execute or print the environment file.
NODE_SETTINGS=$(python3 - /etc/nettruth/node.env /etc/nettruth/turnserver.conf <<'PY'
import ipaddress, pathlib, re, sys

env_path, turn_path = map(pathlib.Path, sys.argv[1:])
try:
    lines = env_path.read_text(encoding='utf-8').splitlines()
except OSError:
    raise SystemExit('Cannot read node configuration. Run this check as root on the measurement node.')
settings = {}
for line in lines:
    key, separator, value = line.partition('=')
    if separator and key in ('NETTRUTH_PUBLIC_IP', 'NETTRUTH_HOSTNAME', 'NETTRUTH_NODE_NAME', 'TURN_HOST'):
        if key in settings:
            raise SystemExit('Duplicate node identity setting; inspect node.env.')
        settings[key] = value
keys = ('NETTRUTH_PUBLIC_IP', 'NETTRUTH_HOSTNAME', 'NETTRUTH_NODE_NAME')
if any(key in settings for key in keys):
    if not all(settings.get(key) for key in keys):
        raise SystemExit('Incomplete node identity; inspect node.env.')
    ip, host, name = (settings[key] for key in keys)
else:
    # Backward compatibility for the installed NYC bundle; do not mislabel an
    # older regional node when a saved display name is unavailable.
    match = re.fullmatch(r'([^:]+):3478', settings.get('TURN_HOST', ''))
    try:
        addresses = re.findall(r'^listening-ip=(.+)$', turn_path.read_text(), re.M)
    except OSError:
        addresses = []
    if not match or len(addresses) != 1:
        raise SystemExit('Cannot determine legacy node identity; inspect node.env and turnserver.conf.')
    ip, host = addresses[0], match.group(1)
    name = 'Elevate360 - New York (NYC1)' if (ip, host) == ('137.184.214.71', 'measure.elevate360systems.com') else ''
try:
    address = ipaddress.IPv4Address(ip)
    if not address.is_global or address.is_multicast or address.is_reserved:
        raise ValueError()
except ValueError:
    raise SystemExit('Invalid configured public IPv4; inspect node.env.')
if not (len(host) <= 253 and '.' in host and not host.rsplit('.', 1)[-1].isdigit() and
        all(re.fullmatch(r'[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?', part) for part in host.split('.'))):
    raise SystemExit('Invalid configured hostname; inspect node.env.')
if name and (not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9 .(),_-]{0,99}', name) or name != name.strip()):
    raise SystemExit('Invalid configured node name; inspect node.env.')
if settings.get('TURN_HOST') != host + ':3478':
    raise SystemExit('Node identity and relay hostname disagree; inspect node.env.')
print(ip)
print(host)
print(name or '(display name not configured)')
PY
)
mapfile -t NODE_IDENTITY <<< "$NODE_SETTINGS"
PUBLIC_IPV4=${NODE_IDENTITY[0]}
MEASUREMENT_HOST=${NODE_IDENTITY[1]}
NODE_NAME=${NODE_IDENTITY[2]}
for service in nettruth-node nettruth-turn caddy; do
    printf '%s: ' "$service"
    systemctl is-active "$service"
done
echo 'Local API health:'
curl -fsS --max-time 5 -H 'Origin: https://www.elevate360systems.com' http://127.0.0.1:8090/health
printf '\nPublic DNS check (%s): ' "$MEASUREMENT_HOST"
if DNS_ANSWER=$(timeout 6 getent ahostsv4 "$MEASUREMENT_HOST"); then
    RESOLVED_IPS=$(printf '%s\n' "$DNS_ANSWER" | awk '{print $1}' | sort -u)
    printf '%s\n' "$RESOLVED_IPS"
    if ! printf '%s\n' "$RESOLVED_IPS" | grep -Fxq "$PUBLIC_IPV4"; then
        printf 'DNS MISMATCH: expected A record %s -> %s. Check the DNS record before TLS troubleshooting.\n' "$MEASUREMENT_HOST" "$PUBLIC_IPV4"
        exit 1
    fi
else
    DNS_STATUS=$?
    if [[ $DNS_STATUS == 124 ]]; then
        echo 'DNS TIMEOUT: the server resolver did not answer within six seconds. Check its DNS connectivity.'
    else
        printf 'DNS FAILED: no IPv4 answer. Check the A record %s -> %s and this server resolver.\n' "$MEASUREMENT_HOST" "$PUBLIC_IPV4"
    fi
    exit 1
fi
printf 'Public HTTPS check: '
PUBLIC_STATUS=0
if curl -fsS --connect-timeout 5 --max-time 10 -H 'Origin: https://www.elevate360systems.com' "https://$MEASUREMENT_HOST/health"; then
    printf '\nHTTPS API reachable. Browser and UDP calibration still required.\n'
else
    PUBLIC_STATUS=$?
    printf '\n'
    case "$PUBLIC_STATUS" in
        5|6) echo 'DNS FAILED during HTTPS request. Check resolver connectivity; the earlier lookup succeeded.' ;;
        35|51|58|60|77|80|82|83|90|91)
            echo 'TLS FAILED: DNS resolved, but the TLS handshake or certificate validation failed.'
            echo 'Inspect: journalctl -u caddy -n 50 --no-pager'
            echo 'Check certificate issuance and inbound TCP 80/443. Do not disable TLS validation.' ;;
        7) echo 'CONNECTION FAILED: DNS resolved; check Caddy and provider/host firewall rules for TCP 443.' ;;
        28) echo 'HTTPS TIMEOUT: inspect resolver, routing, TCP 443 reachability, and Caddy logs.' ;;
        22) echo 'HTTP ERROR: HTTPS answered with an error status; inspect Caddy routing and the measurement API.' ;;
        *) printf 'HTTPS CHECK FAILED (curl exit %s): inspect the curl error and Caddy logs.\n' "$PUBLIC_STATUS" ;;
    esac
fi
if [[ -f /var/run/reboot-required ]]; then echo 'REBOOT REQUIRED: schedule a reboot before calibration, then rerun this check.'; fi
echo 'Node identity for inventory after calibration:'
printf 'HTTPS origin: https://%s\n' "$MEASUREMENT_HOST"
if [[ $NODE_NAME != '(display name not configured)' ]]; then
    printf 'Display name: %s\n' "$NODE_NAME"
else
    echo 'NODE NAME MISSING: reinstall with an explicit NETTRUTH_NODE_NAME to persist this regional identity.'
fi
echo 'Register the verified node in src/lib/nettruth/nodes.json, then build and test the website preview.'
exit "$PUBLIC_STATUS"

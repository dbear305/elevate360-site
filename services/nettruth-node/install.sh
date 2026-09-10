#!/usr/bin/env bash
# Owner-operated beta installer. Defaults to NYC; a new region requires all three
# NETTRUTH_PUBLIC_IP, NETTRUTH_HOSTNAME, and NETTRUTH_NODE_NAME environment values.
set -Eeuo pipefail
umask 027
trap 'printf "\nInstallation stopped at line %s. Keep your SSH session open.\n" "$LINENO" >&2' ERR
NODE_VERSION=24.21.0
NODE_SHA256=fd8e59d5a511510f6a298afb548f18c7d2b1be404d8b4a27d94fbe49f56cb2d6
SOURCE_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)

[[ $EUID == 0 ]] || { echo 'Run as root on the provisioned measurement node.' >&2; exit 1; }
. /etc/os-release
[[ $ID == ubuntu && $VERSION_ID == 24.04 && $(uname -m) == x86_64 ]] || { echo 'Requires Ubuntu 24.04 x64.' >&2; exit 1; }
# This read-only preflight precedes the lock file, backups, or package changes.
# Never source node.env: it contains a secret and is data, not shell code.
command -v python3 >/dev/null || { echo 'Python 3 is required for configuration preflight; nothing changed.' >&2; exit 1; }
NODE_SETTINGS=$(python3 - /etc/nettruth/node.env /etc/nettruth/turnserver.conf <<'PY'
import ipaddress, os, pathlib, re, sys

def stop(message):
    raise SystemExit(message + ' Nothing changed.')

def dns_name(value):
    return (len(value) <= 253 and '.' in value and
            all(re.fullmatch(r'[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?', part)
                for part in value.split('.')) and
            not value.rsplit('.', 1)[-1].isdigit())

def read_environment(path):
    if path.is_symlink() or not path.is_file() or path.stat().st_uid != 0:
        stop('Expected a root-owned regular node.env file.')
    result = {}
    for line in path.read_text(encoding='utf-8').splitlines():
        if not line or line.startswith('#'):
            continue
        key, separator, value = line.partition('=')
        if not separator or not re.fullmatch(r'[A-Z][A-Z0-9_]*', key) or key in result:
            stop('Existing node.env format is ambiguous; inspect it before reinstalling.')
        result[key] = value
    return result

defaults = ('137.184.214.71', 'measure.elevate360systems.com', 'Elevate360 - New York (NYC1)')
keys = ('NETTRUTH_PUBLIC_IP', 'NETTRUTH_HOSTNAME', 'NETTRUTH_NODE_NAME')
env_path, turn_path = map(pathlib.Path, sys.argv[1:])
has_existing = env_path.exists() or env_path.is_symlink()
existing = read_environment(env_path) if has_existing else {}
saved = tuple(existing.get(key) for key in keys)
if has_existing:
    if not re.fullmatch(r'[0-9a-f]{64}', existing.get('TURN_SHARED_SECRET', '')):
        stop('Existing relay secret is unrecognized; refusing to rotate it silently.')
    origins = existing.get('ALLOWED_ORIGINS', '').split(',')
    if any(not value.startswith('https://') or not dns_name(value[8:]) for value in origins):
        stop('Existing ALLOWED_ORIGINS must contain exact bare HTTPS DNS origins.')
    if any(value is not None for value in saved) and not all(saved):
        stop('Existing node identity is incomplete; inspect node.env before reinstalling.')
    if not all(saved):
        # Legacy installs did not persist an identity. Recover it from both
        # service configurations, never assume a non-NYC machine is NYC.
        host_match = re.fullmatch(r'([^:]+):3478', existing.get('TURN_HOST', ''))
        if not host_match or not turn_path.is_file() or turn_path.is_symlink():
            stop('Cannot determine the legacy node identity safely.')
        addresses = re.findall(r'^listening-ip=(.+)$', turn_path.read_text(), re.M)
        if len(addresses) != 1:
            stop('Cannot determine one legacy listening IPv4.')
        saved_ip, saved_host = addresses[0], host_match.group(1)
        saved_name = defaults[2] if (saved_ip, saved_host) == defaults[:2] else os.environ.get(keys[2])
        if not saved_name:
            stop('Legacy non-NYC node needs an explicit NETTRUTH_NODE_NAME.')
        saved = (saved_ip, saved_host, saved_name)
    values = tuple(os.environ.get(key, value) for key, value in zip(keys, saved))
    if values != saved:
        stop('Requested identity conflicts with this existing node; refusing to overwrite its region.')
else:
    supplied = [key in os.environ for key in keys]
    if any(supplied) and not all(supplied):
        stop('A new regional node requires all three NETTRUTH identity values.')
    values = tuple(os.environ.get(key, value) for key, value in zip(keys, defaults))
public_ip, hostname, node_name = values
try:
    address = ipaddress.IPv4Address(public_ip)
    if not address.is_global or address.is_multicast or address.is_reserved:
        raise ValueError()
except ValueError:
    stop('NETTRUTH_PUBLIC_IP must be a directly assigned public IPv4 address.')
if not dns_name(hostname):
    stop('NETTRUTH_HOSTNAME must be a lowercase DNS hostname, without scheme, port, or path.')
if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9 .(),_-]{0,99}', node_name) or node_name != node_name.strip():
    stop('NETTRUTH_NODE_NAME must be 1-100 plain ASCII letters, numbers, spaces, or .(),_- characters.')
if has_existing and existing.get('TURN_HOST') != hostname + ':3478':
    stop('Saved identity and relay hostname disagree; inspect configuration before reinstalling.')
print(public_ip)
print(hostname)
print(node_name)
PY
)
mapfile -t NODE_IDENTITY <<< "$NODE_SETTINGS"
PUBLIC_IPV4=${NODE_IDENTITY[0]}
MEASUREMENT_HOST=${NODE_IDENTITY[1]}
NODE_NAME=${NODE_IDENTITY[2]}
ip -4 -o addr show | awk '{print $4}' | cut -d/ -f1 | grep -Fxq "$PUBLIC_IPV4" || { echo 'Wrong server: expected the assigned NetTruth public IPv4.' >&2; exit 1; }
for source in server.mjs turnserver.conf.example verify.sh OPERATIONS.md; do
    [[ -f "$SOURCE_DIR/$source" ]] || { echo 'Extract the complete installer bundle first.' >&2; exit 1; }
done
exec 9>/run/nettruth-install.lock
flock -n 9 || { echo 'Another NetTruth installation is already running.' >&2; exit 1; }
install -d -m 700 /var/backups/nettruth
BACKUP_DIR=$(mktemp -d /var/backups/nettruth/install-XXXXXXXX)
for target in /etc/caddy/Caddyfile /etc/nettruth/node.env /etc/nettruth/turnserver.conf /etc/systemd/system/nettruth-node.service /etc/systemd/system/nettruth-turn.service; do
    if [[ -f $target ]]; then cp --preserve=mode,timestamps -- "$target" "$BACKUP_DIR/$(basename "$target")"; fi
done

echo '1/6 Installing updates and supported service dependencies...'
export DEBIAN_FRONTEND=noninteractive
export NEEDRESTART_MODE=a
apt-get update
apt-get -y -o Dpkg::Options::=--force-confold upgrade
apt-get install -y --no-install-recommends ca-certificates curl xz-utils gnupg python3 ufw unattended-upgrades debian-keyring debian-archive-keyring apt-transport-https
# Close unsolicited inbound access before installing auto-starting network services.
ufw allow 22/tcp
ufw default deny incoming
ufw default allow outgoing
ufw --force enable
# Caddy's official stable, signed APT repository. No remote shell scripts.
WORK_DIR=$(mktemp -d)
trap 'rm -rf -- "$WORK_DIR"' EXIT
curl --proto '=https' --tlsv1.2 -fsSL --retry 2 --max-time 60 https://dl.cloudsmith.io/public/caddy/stable/gpg.key -o "$WORK_DIR/caddy.asc"
gpg --batch --yes --dearmor --output "$WORK_DIR/caddy.gpg" "$WORK_DIR/caddy.asc"
install -m 644 "$WORK_DIR/caddy.gpg" /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl --proto '=https' --tlsv1.2 -fsSL --retry 2 --max-time 60 https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt -o "$WORK_DIR/caddy.list"
install -m 644 "$WORK_DIR/caddy.list" /etc/apt/sources.list.d/caddy-stable.list
apt-get update
apt-get install -y --no-install-recommends caddy coturn
# The generic coturn unit must not start alongside our isolated service.
systemctl disable --now coturn.service

echo '2/6 Installing the checksum-pinned Node runtime...'
if [[ ! -x /opt/nettruth-runtime/bin/node ]] || [[ $(/opt/nettruth-runtime/bin/node --version) != "v$NODE_VERSION" ]]; then
    curl --proto '=https' --tlsv1.2 -fsSL --retry 2 --max-time 300 "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" -o "$WORK_DIR/node.tar.xz"
    printf '%s  %s\n' "$NODE_SHA256" "$WORK_DIR/node.tar.xz" | sha256sum --check --status
    tar -xJf "$WORK_DIR/node.tar.xz" -C "$WORK_DIR" --no-same-owner
    install -d -m 755 "/opt/node-v$NODE_VERSION"
    cp -a "$WORK_DIR/node-v$NODE_VERSION-linux-x64/." "/opt/node-v$NODE_VERSION/"
    [[ ! -e /opt/nettruth-runtime || -L /opt/nettruth-runtime ]] || { echo 'Unexpected runtime directory; inspect before replacing it.' >&2; exit 1; }
    ln -sfn "/opt/node-v$NODE_VERSION" /opt/nettruth-runtime
fi

echo '3/6 Installing restricted service accounts and private configuration...'
for account in nettruth nettruth-turn; do
    if ! id "$account" >/dev/null 2>&1; then useradd --system --user-group --no-create-home --shell /usr/sbin/nologin "$account"; fi
done
install -d -m 755 /opt/nettruth-node
# Directory traversal is allowed; secret files below restrict actual reads.
install -d -m 755 /etc/nettruth
install -m 644 "$SOURCE_DIR/server.mjs" /opt/nettruth-node/server.mjs
install -m 755 "$SOURCE_DIR/verify.sh" /opt/nettruth-node/verify.sh
install -m 644 "$SOURCE_DIR/OPERATIONS.md" /opt/nettruth-node/OPERATIONS.md
/opt/nettruth-runtime/bin/node --check /opt/nettruth-node/server.mjs
python3 - "$SOURCE_DIR" "$PUBLIC_IPV4" "$MEASUREMENT_HOST" "$NODE_NAME" <<'PY'
import grp, pathlib, re, secrets, sys, os
source, ip, host, name = sys.argv[1:]
env_path = pathlib.Path('/etc/nettruth/node.env')
secret = None
origins = 'https://www.elevate360systems.com,https://elevate360systems.com'
if env_path.exists():
    previous = env_path.read_text()
    found = re.findall(r'^TURN_SHARED_SECRET=([0-9a-f]{64})$', previous, re.M)
    allowed = re.findall(r'^ALLOWED_ORIGINS=(.+)$', previous, re.M)
    if len(found) != 1 or len(allowed) != 1:
        raise SystemExit('Existing relay secret is unrecognized; refusing to rotate it silently.')
    secret = found[0]
    origins = allowed[0]
secret = secret or secrets.token_hex(32)
env_path.write_text(f'''ALLOWED_ORIGINS={origins}
NETTRUTH_PUBLIC_IP={ip}
NETTRUTH_HOSTNAME={host}
NETTRUTH_NODE_NAME={name}
BIND_HOST=127.0.0.1
PORT=8090
TRUST_LOOPBACK_PROXY=true
HOURLY_BYTE_LIMIT=2147483648
TURN_HOST={host}:3478
TURN_SHARED_SECRET={secret}
''')
os.chmod(env_path, 0o600)
conf = pathlib.Path(source, 'turnserver.conf.example').read_text()
conf = conf.replace('PUBLIC_IPV4', ip).replace('DOMAIN', host).replace('RANDOM_SHARED_SECRET', secret)
conf += '\npidfile=/run/nettruth-turn/turn.pid\nno-stdout-log\nsimple-log\nlog-file=/dev/null\n'
turn_path = pathlib.Path('/etc/nettruth/turnserver.conf')
turn_path.write_text(conf)
os.chmod(turn_path, 0o640)
os.chown(turn_path, 0, grp.getgrnam('nettruth-turn').gr_gid)
PY

cat > /etc/systemd/system/nettruth-node.service <<'UNIT'
[Unit]
Description=NetTruth HTTP measurement node
After=network-online.target
Wants=network-online.target
StartLimitIntervalSec=60
StartLimitBurst=5
[Service]
Type=simple
User=nettruth
Group=nettruth
WorkingDirectory=/opt/nettruth-node
EnvironmentFile=/etc/nettruth/node.env
ExecStart=/opt/nettruth-runtime/bin/node /opt/nettruth-node/server.mjs
Restart=on-failure
RestartSec=3
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true
RestrictSUIDSGID=true
RestrictAddressFamilies=AF_INET AF_INET6 AF_UNIX
CapabilityBoundingSet=
MemoryMax=512M
TasksMax=128
[Install]
WantedBy=multi-user.target
UNIT
cat > /etc/systemd/system/nettruth-turn.service <<'UNIT'
[Unit]
Description=NetTruth restricted UDP measurement relay
After=network-online.target
Wants=network-online.target
StartLimitIntervalSec=60
StartLimitBurst=5
[Service]
Type=simple
User=nettruth-turn
Group=nettruth-turn
RuntimeDirectory=nettruth-turn
RuntimeDirectoryMode=0700
ExecStart=/usr/bin/turnserver -c /etc/nettruth/turnserver.conf
Restart=on-failure
RestartSec=3
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true
RestrictSUIDSGID=true
RestrictAddressFamilies=AF_INET AF_INET6 AF_UNIX
CapabilityBoundingSet=
MemoryMax=512M
TasksMax=128
[Install]
WantedBy=multi-user.target
UNIT
cat > /etc/caddy/Caddyfile <<CADDY
$MEASUREMENT_HOST {
    reverse_proxy 127.0.0.1:8090 {
        header_up X-Real-IP {remote_host}
        flush_interval -1
    }
}
CADDY
chmod 644 /etc/caddy/Caddyfile
caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile

echo '4/6 Configuring the host firewall and Ubuntu security updates...'
# Preserve SSH access before enabling the firewall. No SSH keys or sshd settings change.
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3478/udp
ufw allow 49160:49259/udp
ufw default deny incoming
ufw default allow outgoing
ufw --force enable
cat > /etc/apt/apt.conf.d/20auto-upgrades <<'APT'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT
cat > /etc/apt/apt.conf.d/52nettruth-no-auto-reboot <<'APT'
Unattended-Upgrade::Automatic-Reboot "false";
APT

echo '5/6 Starting measurement services...'
systemctl daemon-reload
systemctl enable nettruth-node.service nettruth-turn.service caddy.service
systemctl restart nettruth-node.service nettruth-turn.service
systemctl reload-or-restart caddy.service
curl -fsS --retry 5 --retry-connrefused --retry-delay 1 --max-time 5 -H 'Origin: https://www.elevate360systems.com' http://127.0.0.1:8090/health >/dev/null

echo '6/6 Verifying local services and reporting remaining launch gates...'
VERIFY_STATUS=0
bash /opt/nettruth-node/verify.sh || VERIFY_STATUS=$?
printf '\nConfiguration backups: %s\n' "$BACKUP_DIR"
echo 'Installation does not publish the website or certify measurement accuracy.'
if [[ $VERIFY_STATUS != 0 ]]; then
    echo 'Installation steps finished, but verification is pending. Resolve the reported check and rerun /opt/nettruth-node/verify.sh.'
fi
exit "$VERIFY_STATUS"

#!/usr/bin/env bash
set -Eeuo pipefail
for service in nettruth-node nettruth-turn caddy; do
    printf '%s: ' "$service"
    systemctl is-active "$service"
done
echo 'Local API health:'
curl -fsS --max-time 5 -H 'Origin: https://www.elevate360systems.com' http://127.0.0.1:8090/health
printf '\nPublic HTTPS check: '
if curl -fsS --connect-timeout 5 --max-time 10 -H 'Origin: https://www.elevate360systems.com' https://measure.elevate360systems.com/health; then
    printf '\nHTTPS API reachable. Browser and UDP calibration still required.\n'
else
    printf '\nPENDING: set DNS A record measure.elevate360systems.com to 137.184.214.71, then rerun this check.\n'
    echo 'Also check Caddy service errors and provider firewall rules if DNS is correct.'
fi
if [[ -f /var/run/reboot-required ]]; then echo 'REBOOT REQUIRED: schedule a reboot before calibration, then rerun this check.'; fi
echo 'Website configuration after calibration:'
echo 'NETTRUTH_NODE_ORIGIN=https://measure.elevate360systems.com'
echo 'NETTRUTH_NODE_NAME=Elevate360 - New York (NYC1)'

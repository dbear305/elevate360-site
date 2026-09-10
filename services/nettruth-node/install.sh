#!/usr/bin/env bash
# Owner-operated beta installer. Run only on Daniel's provisioned measurement node.
set -Eeuo pipefail
umask 027
trap 'printf "\nInstallation stopped at line %s. Keep your SSH session open.\n" "$LINENO" >&2' ERR
NODE_VERSION=24.21.0
NODE_SHA256=fd8e59d5a511510f6a298afb548f18c7d2b1be404d8b4a27d94fbe49f56cb2d6
PUBLIC_IPV4=137.184.214.71
MEASUREMENT_HOST=measure.elevate360systems.com
SOURCE_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)

[[ $EUID == 0 ]] || { echo 'Run as root on nettruth-01.' >&2; exit 1; }
. /etc/os-release
[[ $ID == ubuntu && $VERSION_ID == 24.04 && $(uname -m) == x86_64 ]] || { echo 'Requires Ubuntu 24.04 x64.' >&2; exit 1; }
ip -4 -o addr show | awk '{print $4}' | cut -d/ -f1 | grep -Fxq "$PUBLIC_IPV4" || { echo 'Wrong server: expected the assigned NetTruth public IPv4.' >&2; exit 1; }
[[ -f "$SOURCE_DIR/server.mjs" && -f "$SOURCE_DIR/turnserver.conf.example" ]] || { echo 'Extract the complete installer bundle first.' >&2; exit 1; }
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
python3 - "$SOURCE_DIR" "$PUBLIC_IPV4" "$MEASUREMENT_HOST" <<'PY'
import grp, pathlib, re, secrets, sys, os
source, ip, host = sys.argv[1:]
env_path = pathlib.Path('/etc/nettruth/node.env')
secret = None
if env_path.exists():
    found = re.search(r'^TURN_SHARED_SECRET=([0-9a-f]{64})$', env_path.read_text(), re.M)
    if not found:
        raise SystemExit('Existing relay secret is unrecognized; refusing to rotate it silently.')
    secret = found.group(1)
secret = secret or secrets.token_hex(32)
env_path.write_text(f'''ALLOWED_ORIGINS=https://www.elevate360systems.com,https://elevate360systems.com
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
bash /opt/nettruth-node/verify.sh
printf '\nConfiguration backups: %s\n' "$BACKUP_DIR"
echo 'Installation does not publish the website or certify measurement accuracy.'

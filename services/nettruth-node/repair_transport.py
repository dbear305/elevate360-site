#!/usr/bin/env python3
"""Repair the stock dedicated NetTruth Caddy config; dry-run unless --apply.

Retains HTTPS, the node, TURN, quotas, DNS and the website. Refuses customized
or shared Caddy configs. Intended for the existing Ubuntu systemd installation.
"""
import argparse
import datetime
import json
import os
from pathlib import Path
import re
import shutil
import socket
import ssl
import stat
import subprocess
import sys
import tempfile
import time

CONFIG = Path('/etc/caddy/Caddyfile')
ORIGIN = 'https://www.elevate360systems.com'
PREFIX = '# NetTruth bounded transport repair: retain TLS; avoid small HTTP/2 receive windows.\n{\n    servers :443 {\n        protocols h1\n    }\n}\n\n'
STOCK = re.compile(r'(measure-(?:miami|dfw)\.elevate360systems\.com)\s*\{\s*reverse_proxy\s+127\.0\.0\.1:8090\s*\{\s*header_up\s+X-Real-IP\s+\{remote_host\}\s*flush_interval\s+-1\s*\}\s*\}\s*')


def plan(original):
    text = original.decode('utf-8')
    already = text.startswith(PREFIX)
    body = text[len(PREFIX):] if already else text
    clean = '\n'.join(line.split('#', 1)[0] for line in body.splitlines()).strip()
    match = STOCK.fullmatch(clean)
    if not match:
        raise RuntimeError('STOP: Caddyfile is not the stock, single-host NetTruth configuration. No changes made.')
    return match.group(1), original if already else (PREFIX + body).encode('utf-8')


def command(args, timeout=30):
    result = subprocess.run(args, capture_output=True, text=True, timeout=timeout)
    if result.returncode:
        # Do not dump environment variables, arbitrary config contents or credentials.
        raise RuntimeError(f'{args[0]} {args[1]} failed (exit {result.returncode}). Inspect the service locally.')
    return result.stdout


def health(host=None):
    args = ['curl', '--fail', '--silent', '--show-error', '--noproxy', '*', '--max-time', '8', '-H', 'Origin: ' + ORIGIN]
    if host:
        args += ['--http1.1', '--resolve', f'{host}:443:127.0.0.1', f'https://{host}/health']
    else:
        args += ['http://127.0.0.1:8090/health']
    value = json.loads(command(args, timeout=10))
    if value.get('status') != 'ok' or value.get('protocol') != 'nettruth-node.v1':
        raise RuntimeError('Unexpected measurement-node health response.')
    return value.get('udpRelayConfigured')


def negotiated_protocol(host):
    context = ssl.create_default_context()
    context.set_alpn_protocols(['h2', 'http/1.1'])
    with socket.create_connection(('127.0.0.1', 443), timeout=5) as tcp:
        with context.wrap_socket(tcp, server_hostname=host) as tls:
            return tls.selected_alpn_protocol()


def write_candidate(data, metadata):
    fd, name = tempfile.mkstemp(prefix='.nettruth-candidate-', dir=CONFIG.parent)
    path = Path(name)
    try:
        with os.fdopen(fd, 'wb') as stream:
            stream.write(data)
            stream.flush()
            os.fchown(stream.fileno(), metadata.st_uid, metadata.st_gid)
            os.fchmod(stream.fileno(), stat.S_IMODE(metadata.st_mode))
            os.fsync(stream.fileno())
        return path
    except BaseException:
        path.unlink(missing_ok=True)
        raise


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true', help='Validate, back up, reload and verify; roll back on failure.')
    args = parser.parse_args()
    if os.geteuid() != 0:
        raise RuntimeError('Run on the measurement VPS as root or with sudo.')
    for program in ('caddy', 'curl', 'systemctl'):
        if not shutil.which(program):
            raise RuntimeError(f'STOP: {program} is missing. No packages installed or changes made.')
    metadata = CONFIG.lstat()
    if not stat.S_ISREG(metadata.st_mode) or metadata.st_uid != 0 or metadata.st_mode & 0o022:
        raise RuntimeError('STOP: expected a root-owned, non-writable-by-others regular Caddyfile.')
    original = CONFIG.read_bytes()
    host, replacement = plan(original)
    command(['systemctl', 'is-active', '--quiet', 'caddy'])
    service = command(['systemctl', 'show', 'caddy', '-p', 'ExecStart', '--value'])
    if '/etc/caddy/Caddyfile' not in service or '--resume' in service:
        raise RuntimeError('STOP: Caddy service does not use the expected file. No changes made.')
    relay = health()
    if health(host) != relay:
        raise RuntimeError('STOP: proxy and local node do not agree. No changes made.')
    print(f'Host: {host}; existing negotiated protocol: {negotiated_protocol(host)}', flush=True)
    candidate = write_candidate(replacement, metadata)
    try:
        command(['caddy', 'validate', '--config', str(candidate), '--adapter', 'caddyfile'])
        if replacement == original:
            print('Configuration already patched; no files changed.')
            if negotiated_protocol(host) != 'http/1.1':
                raise RuntimeError('Disk config is patched but live protocol differs. Inspect active Caddy configuration.')
            return
        if not args.apply:
            print('DRY RUN PASSED. Would set HTTPS measurement traffic to HTTP/1.1. Use --apply to change it.')
            return
        backup_dir = Path('/var/backups/nettruth-transport')
        backup_dir.mkdir(mode=0o700, parents=True, exist_ok=True)
        if backup_dir.is_symlink() or backup_dir.stat().st_uid != 0 or backup_dir.stat().st_mode & 0o077:
            raise RuntimeError('STOP: unsafe backup directory. No changes made.')
        backup = backup_dir / ('Caddyfile-' + datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%S%fZ') + '.bak')
        with backup.open('xb') as stream:
            stream.write(original)
            stream.flush()
            os.fsync(stream.fileno())
        backup.chmod(0o600)
        if CONFIG.read_bytes() != original:
            raise RuntimeError('STOP: Caddyfile changed during validation. Nothing overwritten.')
        changed = False
        try:
            os.replace(candidate, CONFIG)
            changed = True
            command(['systemctl', 'reload', 'caddy'])
            healthy = False
            for _ in range(5):
                try:
                    healthy = negotiated_protocol(host) == 'http/1.1' and health(host) == relay
                except (RuntimeError, OSError, ValueError, subprocess.SubprocessError):
                    healthy = False
                if healthy:
                    break
                time.sleep(1)
            if not healthy:
                raise RuntimeError('Post-reload TLS/protocol/health verification failed.')
        except BaseException:
            if changed:
                restore = write_candidate(original, metadata)
                os.replace(restore, CONFIG)
                try:
                    command(['systemctl', 'reload', 'caddy'])
                    health(host)
                    print('ROLLED BACK: original config restored and health checked.', file=sys.stderr)
                except Exception:
                    print(f'URGENT: rollback verification failed. Original config backup: {backup}', file=sys.stderr)
            raise
        print('APPLIED AND VERIFIED: HTTPS + HTTP/1.1; measurement node healthy; UDP relay flag unchanged.')
        print('No DNS, firewall, quotas, Node code, TURN credentials, website or packages changed.')
        print(f'Backup: {backup}')
        print(f'Rollback: cp {backup} {CONFIG} && chmod 644 {CONFIG} && systemctl reload caddy')
        print('Close old test tabs, then open a fresh tab and select Miami explicitly for the comparison.')
        print('This removes the observed HTTP/2 upload constraint; it does not guarantee a specific speed or explain every latency difference.')
    finally:
        candidate.unlink(missing_ok=True)


if __name__ == '__main__':
    try:
        main()
    except (RuntimeError, OSError, ValueError, subprocess.SubprocessError) as error:
        print(f'FAILED: {error}', file=sys.stderr)
        sys.exit(1)

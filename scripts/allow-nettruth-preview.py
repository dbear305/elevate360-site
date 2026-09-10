"""Accept one exact Vercel deployment origin, preserve other settings, verify restart.

Run as root on nettruth-01 via SSH stdin. Never prints relay secrets.
"""
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.request


def updated_environment(text, origin):
    if not re.fullmatch(r'https://[a-z0-9-]+\.vercel\.app', origin):
        raise ValueError('Expected one bare HTTPS Vercel deployment origin.')
    lines = text.splitlines(keepends=True)
    positions = [i for i, line in enumerate(lines) if line.startswith('ALLOWED_ORIGINS=')]
    if len(positions) != 1:
        raise ValueError('Expected exactly one ALLOWED_ORIGINS setting; no changes made.')
    i = positions[0]
    origins = lines[i].strip().split('=', 1)[1].split(',')
    if any(not re.fullmatch(r'https://[a-z0-9.-]+', item) for item in origins):
        raise ValueError('Unexpected existing origin format; no changes made.')
    if origin in origins:
        return text
    origins.append(origin)
    lines[i] = 'ALLOWED_ORIGINS=' + ','.join(origins) + '\n'
    return ''.join(lines)


def replace_atomic(path, text):
    fd, name = tempfile.mkstemp(prefix='.nettruth-env-', dir=path.parent)
    try:
        with os.fdopen(fd, 'w', encoding='utf-8', newline='\n') as f:
            os.fchmod(f.fileno(), 0o600)
            f.write(text)
            f.flush()
            os.fsync(f.fileno())
        os.replace(name, path)
    finally:
        if os.path.exists(name):
            os.unlink(name)


def main():
    if os.geteuid() != 0 or len(sys.argv) != 2:
        raise ValueError('Run as root with exactly one preview origin.')
    path = Path('/etc/nettruth/node.env')
    if path.is_symlink() or path.stat().st_uid != 0:
        raise ValueError('Expected a root-owned regular configuration file.')
    old = path.read_text(encoding='utf-8')
    new = updated_environment(old, sys.argv[1])
    changed = new != old
    if changed:
        backup_dir = Path('/var/backups/nettruth')
        backup_dir.mkdir(mode=0o700, parents=True, exist_ok=True)
        fd, backup = tempfile.mkstemp(prefix='preview-', suffix='.env', dir=backup_dir)
        os.close(fd)
        shutil.copyfile(path, backup)
        os.chmod(backup, 0o600)
        replace_atomic(path, new)
    try:
        if changed:
            subprocess.run(['systemctl', 'restart', 'nettruth-node'], check=True)
        for attempt in range(10):
            try:
                request = urllib.request.Request('http://127.0.0.1:8090/health', headers={'Origin': sys.argv[1]})
                with urllib.request.urlopen(request, timeout=2) as response:
                    body = json.load(response)
                    if body.get('status') != 'ok' or body.get('protocol') != 'nettruth-node.v1':
                        raise ValueError('Unexpected API health response.')
                print('Exact preview origin authorized; local API health passed.')
                return
            except (OSError, ValueError):
                if attempt == 9:
                    raise
                time.sleep(0.5)
    except Exception:
        if changed:
            replace_atomic(path, old)
            subprocess.run(['systemctl', 'restart', 'nettruth-node'], check=True)
        raise RuntimeError('Preview authorization failed; prior settings restored. Inspect nettruth-node service status.') from None


if __name__ == '__main__':
    main()

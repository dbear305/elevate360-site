#!/data/data/com.termux/files/usr/bin/bash
set -Eeuo pipefail
[[ ${PREFIX:-} == */com.termux/files/usr ]] || { echo 'Run this in Termux at the ~ $ prompt.' >&2; exit 1; }
gp run bash -c 'v=$(dpkg-query -W -f="${Version}" libglycin-2-0) && dpkg --compare-versions "$v" ge "2.2~alpha.7"' || {
    echo 'The installed Glycin library does not support the verified workaround.' >&2
    exit 1
}
python - <<'PY'
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
from datetime import datetime, timezone

home = Path.home()
paths = [home / 'kali-arm64/usr/local/lib/galaxy-kali-pocket/desktop.sh',
         home / '.local/share/galaxy-kali-pocket/kali-desktop.sh']
old_session = 'unset SESSION_MANAGER DBUS_SESSION_BUS_ADDRESS\n'
new_session = old_session + 'export GLYCIN_DISABLE_SANDBOX=i-know-the-risks\n'
old_server = '        tigervncserver "$DISPLAY_NUMBER" -localhost yes -SecurityTypes VncAuth '
new_server = ('        tigervncserver -list "$DISPLAY_NUMBER" -cleanstale\n'
              '        exec tigervncserver "$DISPLAY_NUMBER" -fg -localhost yes -SecurityTypes VncAuth ')
plans = []
for path in paths:
    original = path.read_text()
    if new_session in original and new_server in original:
        continue
    if original.count(old_session) != 1 or original.count(old_server) != 1:
        raise SystemExit(f'Unexpected desktop script; nothing changed: {path}')
    updated = original.replace(old_session, new_session).replace(old_server, new_server)
    with tempfile.NamedTemporaryFile(mode='w', suffix='.sh') as check:
        check.write(updated)
        check.flush()
        subprocess.run(['bash', '-n', check.name], check=True)
    plans.append((path, updated))
stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
for path, updated in plans:
    backup = path.with_name(path.name + '.before-desktop-repair-' + stamp)
    shutil.copy2(path, backup)
    fd, temporary = tempfile.mkstemp(dir=path.parent, prefix='desktop-repair-')
    try:
        with os.fdopen(fd, 'w') as output:
            output.write(updated)
        os.chmod(temporary, path.stat().st_mode & 0o777)
        os.replace(temporary, path)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)
    print(f'Backup: {backup}')
print('Startup repair installed. Your running desktop was not restarted.')
print('Next time: gp desktop start; then connect AVNC to 127.0.0.1:5902.')
PY

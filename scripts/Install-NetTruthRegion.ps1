#requires -Version 7.3
<#
.SYNOPSIS
Installs the reviewed NetTruth node source on an owner-provisioned Ubuntu server.
.DESCRIPTION
Run this script in PowerShell 7.3 or newer on Windows, from the downloaded repository. First
set the measurement hostname's DNS A record to the new server's public IPv4.
If an AAAA record exists, it must point to this server's working public IPv6;
otherwise remove that AAAA record before requesting the TLS certificate.

Obtain the server's ED25519 fingerprint in the provider's authenticated web
console, using this read-only Ubuntu command:
  ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub -E sha256

Supply the full SHA256:... fingerprint below. The script checks saved ED25519
host keys against that fingerprint, or retrieves a public key when none is saved.
Every SSH connection strictly verifies the pinned key before authentication.
Conflicting existing ED25519 entries are rejected. Only the reviewed public
service source is uploaded; the YubiKey identity stays on this PC.

The provider firewall must allow TCP 22, 80, 443 and UDP 3478, 49160-49259.
The installer configures the Ubuntu firewall. It does not create the server,
change provider firewall rules, publish the website, or certify accuracy.

If SSH closes after upload but before extraction, provide ResumeStage and
ResumeArchiveSHA256 using the exact directory and archive hash printed by the
failed run. Resume uses one authenticated connection and repeats all host-pin,
archive integrity and file-inventory checks. Existing extracted files are not
overwritten; inspect a partially started installation before retrying it.
.EXAMPLE
.\scripts\Install-NetTruthRegion.ps1 -PublicIPv4 'THE_NEW_SERVER_IP' -HostFingerprint 'SHA256:THE_VERIFIED_SERVER_FINGERPRINT'
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$PublicIPv4,

    [Parameter(Mandatory = $true)]
    [string]$HostFingerprint,

    [string]$MeasurementHostname = 'measure-dfw.elevate360systems.com',
    [string]$NodeName = 'Elevate360 - Dallas (DFW)',
    [string]$IdentityFile = (Join-Path $env:USERPROFILE '.ssh\nettruth_yubi_02'),
    [string]$ResumeStage = '',
    [string]$ResumeArchiveSHA256 = ''
)

$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $false
$PSNativeCommandArgumentPassing = 'Standard'
Set-StrictMode -Version Latest
if (-not $IsWindows) { throw 'Run this owner handoff in PowerShell 7 on your Windows PC.' }
if ([string]::IsNullOrEmpty($ResumeStage) -ne [string]::IsNullOrEmpty($ResumeArchiveSHA256)) {
    throw 'ResumeStage and ResumeArchiveSHA256 must be supplied together.'
}
if ($ResumeStage -and ($ResumeStage -cnotmatch '^/root/nettruth-install-[A-Za-z0-9_-]+\z' -or
    $ResumeArchiveSHA256 -cnotmatch '^[0-9a-f]{64}\z')) {
    throw 'Resume requires the exact preserved staging directory and lowercase SHA-256 printed during upload.'
}

$parsedIP = $null
if ($PublicIPv4 -notmatch '^[0-9]{1,3}(\.[0-9]{1,3}){3}$' -or
    -not [Net.IPAddress]::TryParse($PublicIPv4, [ref]$parsedIP) -or
    $parsedIP.AddressFamily -ne [Net.Sockets.AddressFamily]::InterNetwork -or
    $parsedIP.ToString() -cne $PublicIPv4) {
    throw 'PublicIPv4 must be one canonical IPv4 address, with no port or other text.'
}
if ($HostFingerprint -cnotmatch '^SHA256:[A-Za-z0-9+/]{43}$') {
    throw 'HostFingerprint must be the complete SHA256:... ED25519 fingerprint from the provider web console.'
}
if ($MeasurementHostname.Length -gt 253 -or
    $MeasurementHostname -cnotmatch '^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?$') {
    throw 'MeasurementHostname must be a lowercase DNS hostname without a scheme, port, or path.'
}
if ($NodeName -cnotmatch '^[A-Za-z0-9][A-Za-z0-9 .(),_-]{0,99}$' -or $NodeName -cne $NodeName.Trim()) {
    throw 'NodeName must contain 1-100 plain ASCII letters, numbers, spaces, or .(),_- characters.'
}
foreach ($command in @('ssh.exe', 'scp.exe', 'ssh-keygen.exe')) {
    if (-not (Get-Command $command -CommandType Application -ErrorAction SilentlyContinue)) {
        throw "Missing $command. Install the Windows OpenSSH Client before continuing."
    }
}
if (-not (Test-Path -LiteralPath $IdentityFile -PathType Leaf)) {
    throw "Your local YubiKey identity file was not found at $IdentityFile."
}
$IdentityFile = (Resolve-Path -LiteralPath $IdentityFile).Path
$sourceRoot = Join-Path (Split-Path -Parent $PSScriptRoot) 'services\nettruth-node'
$sourceFiles = @(
    'install.sh', 'server.mjs', 'turnserver.conf.example', 'verify.sh',
    'OPERATIONS.md', 'Caddyfile.example', 'Dockerfile'
)
foreach ($file in $sourceFiles) {
    $path = Join-Path $sourceRoot $file
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
        throw "Missing source file: $path. Use the complete reviewed repository download."
    }
    if ((Get-Item -LiteralPath $path).LinkType) {
        throw "Source file $file is a link. Use regular files from the reviewed repository download."
    }
    if ($file.EndsWith('.sh') -and [IO.File]::ReadAllText($path).Contains("`r")) {
        throw "$file contains Windows line endings. Download the repository ZIP, which preserves the reviewed Linux files."
    }
}

Write-Host "Checking DNS: $MeasurementHostname must resolve to $PublicIPv4."
try {
    $dnsTask = [Net.Dns]::GetHostAddressesAsync($MeasurementHostname)
    if (-not $dnsTask.Wait(10000)) { throw 'DNS lookup timed out after ten seconds.' }
    $ipv4Answers = @($dnsTask.GetAwaiter().GetResult() |
        Where-Object AddressFamily -eq ([Net.Sockets.AddressFamily]::InterNetwork) |
        ForEach-Object { $_.ToString() } | Sort-Object -Unique)
    if ($ipv4Answers.Count -ne 1 -or $ipv4Answers[0] -cne $PublicIPv4) {
        throw "Expected only $PublicIPv4; received: $($ipv4Answers -join ', ')."
    }
} catch {
    throw "DNS is not ready. Set the A record $MeasurementHostname to $PublicIPv4, then rerun. $($_.Exception.Message) Nothing uploaded."
}

function ConvertTo-ShellLiteral {
    param([Parameter(Mandatory = $true)][string]$Value)
    return "'" + $Value.Replace("'", "'\''") + "'"
}

function Get-Ed25519Fingerprint {
    param([Parameter(Mandatory = $true)][string]$KeyFile)
    $output = @(& ssh-keygen.exe -lf $KeyFile -E sha256)
    if ($LASTEXITCODE -ne 0 -or $output.Count -ne 1) {
        throw 'Could not read one ED25519 host-key fingerprint. Nothing uploaded.'
    }
    $fingerprintMatch = [regex]::Match($output[0], '^256 (SHA256:[A-Za-z0-9+/]{43}) .*\(ED25519\)$')
    if (-not $fingerprintMatch.Success) { throw 'Could not parse one ED25519 host-key fingerprint. Nothing uploaded.' }
    return $fingerprintMatch.Groups[1].Value
}

$localWork = Join-Path ([IO.Path]::GetTempPath()) ('nettruth-region-' + [Guid]::NewGuid().ToString('N'))
$remoteStage = $null
$installationInvoked = $false
[IO.Directory]::CreateDirectory($localWork) | Out-Null
try {
    $utf8 = [Text.UTF8Encoding]::new($false)
    $pinnedHosts = Join-Path $localWork 'known_hosts'
    $pinnedKeyLine = $null

    # Inspect every standard store before using a matching saved key. Regular
    # SSH verifies the server's possession of this exact key on each connection.
    # This also avoids the unsupported-KEX defect in Windows 9.5 ssh-keyscan
    # when the owner already has a host key from a successful SSH connection.
    # A dedicated empty client config makes the connection independent of
    # user aliases, ProxyCommand settings, agents, or extra identities.
    $knownHostPaths = @(
        (Join-Path $env:USERPROFILE '.ssh\known_hosts'),
        (Join-Path $env:USERPROFILE '.ssh\known_hosts2')
    )
    if ($env:ProgramData) {
        $knownHostPaths += Join-Path $env:ProgramData 'ssh\ssh_known_hosts'
        $knownHostPaths += Join-Path $env:ProgramData 'ssh\ssh_known_hosts2'
    }
    $alreadyRecorded = $false
    Write-Host 'Checking saved SSH host keys against the supplied fingerprint...'
    foreach ($knownFile in $knownHostPaths) {
        if (-not (Test-Path -LiteralPath $knownFile -PathType Leaf)) { continue }
        foreach ($lookup in @($PublicIPv4, $MeasurementHostname)) {
            $found = @(& ssh-keygen.exe -F $lookup -f $knownFile)
            $findStatus = $LASTEXITCODE
            if ($findStatus -eq 1) { continue }
            if ($findStatus -ne 0) { throw "Could not inspect $knownFile. Nothing uploaded." }
            foreach ($line in $found) {
                $record = $line.ToString().Trim()
                if (-not $record -or $record.StartsWith('#')) { continue }
                if ($record.StartsWith('@')) {
                    throw "A marked host entry exists for $lookup in $knownFile. Review it before installing. Nothing uploaded."
                }
                $parts = $record -split '\s+'
                if ($parts.Count -lt 3) { throw "Malformed host entry in $knownFile. Nothing uploaded." }
                if ($parts[1] -cne 'ssh-ed25519') { continue }
                if ($parts[2] -cnotmatch '^[A-Za-z0-9+/]+={0,2}$') {
                    throw "Malformed ED25519 key in $knownFile. Nothing uploaded."
                }
                $existingKey = Join-Path $localWork 'existing_host_key'
                [IO.File]::WriteAllText($existingKey, $record + "`n", $utf8)
                if ((Get-Ed25519Fingerprint $existingKey) -cne $HostFingerprint) {
                    throw "EXISTING HOST KEY MISMATCH for $lookup in $knownFile. No keys were replaced; nothing uploaded."
                }
                # Canonicalize hashed names, hostname aliases and comments to
                # the exact IPv4 destination used by the isolated SSH client.
                $pinnedKeyLine = "$PublicIPv4 ssh-ed25519 $($parts[2])"
                if ($lookup -ceq $PublicIPv4 -and $knownFile -ceq $knownHostPaths[0]) { $alreadyRecorded = $true }
            }
        }
    }
    if ($pinnedKeyLine) {
        Write-Host 'Saved server key matches. SSH will verify this exact key on every connection.'
    } else {
        if (-not (Get-Command 'ssh-keyscan.exe' -CommandType Application -ErrorAction SilentlyContinue)) {
            throw 'No saved ED25519 host key and ssh-keyscan.exe is missing. Nothing uploaded.'
        }
        $scanErrors = Join-Path $localWork 'keyscan-stderr.txt'
        Write-Host 'Retrieving the public SSH host key for fingerprint verification...'
        $scanned = @(& ssh-keyscan.exe -T 10 -t ed25519 $PublicIPv4 2> $scanErrors)
        $scanExitCode = $LASTEXITCODE
        if ($scanExitCode -ne 0) {
            $scanDetail = if (Test-Path -LiteralPath $scanErrors -PathType Leaf) {
                ((Get-Content -LiteralPath $scanErrors -Tail 12) -join [Environment]::NewLine).Trim()
            } else { '' }
            if (-not $scanDetail) { $scanDetail = 'ssh-keyscan returned no diagnostic text.' }
            throw "SSH host-key retrieval failed (exit $scanExitCode). This check does not use the YubiKey. Nothing uploaded.`n$scanDetail"
        }
        $scanPattern = '^' + [regex]::Escape($PublicIPv4) + ' ssh-ed25519 [A-Za-z0-9+/]+={0,2}$'
        $keyLines = @($scanned | ForEach-Object { $_.ToString().Trim() } |
            Where-Object { $_ -cmatch $scanPattern } | Sort-Object -Unique)
        if ($keyLines.Count -ne 1) { throw 'The server did not present one unambiguous ED25519 key. Nothing uploaded.' }
        $pinnedKeyLine = $keyLines[0]
    }
    [IO.File]::WriteAllText($pinnedHosts, $pinnedKeyLine + "`n", $utf8)
    if ((Get-Ed25519Fingerprint $pinnedHosts) -cne $HostFingerprint) {
        throw 'HOST KEY MISMATCH. The selected key does not match the supplied fingerprint. Nothing uploaded.'
    }
    if (-not $alreadyRecorded) {
        $knownFile = $knownHostPaths[0]
        [IO.Directory]::CreateDirectory((Split-Path -Parent $knownFile)) | Out-Null
        [IO.File]::AppendAllText($knownFile, "`n" + $pinnedKeyLine + "`n", $utf8)
    }

    $clientConfig = Join-Path $localWork 'ssh_config'
    [IO.File]::WriteAllText($clientConfig, '', $utf8)
    $pinPath = $pinnedHosts.Replace('\', '/')
    $sshOptions = @(
        '-F', $clientConfig,
        '-o', 'StrictHostKeyChecking=yes',
        '-o', "UserKnownHostsFile=`"$pinPath`"",
        '-o', 'GlobalKnownHostsFile=none',
        '-o', 'HostKeyAlgorithms=ssh-ed25519',
        '-o', 'IdentitiesOnly=yes',
        '-o', 'IdentityAgent=none',
        '-o', 'PreferredAuthentications=publickey',
        '-o', 'PasswordAuthentication=no',
        '-o', 'KbdInteractiveAuthentication=no',
        '-o', 'ConnectTimeout=10',
        '-o', 'ServerAliveInterval=30',
        '-o', 'ServerAliveCountMax=6',
        '-i', $IdentityFile
    )
    $destination = "root@$PublicIPv4"
    Write-Host "Pinned host fingerprint: $HostFingerprint"
    if ($ResumeStage) {
        $remoteStage = $ResumeStage
        $archiveHash = $ResumeArchiveSHA256
        Write-Host "Resuming the preserved upload at $remoteStage."
        Write-Host "Required archive SHA-256: $archiveHash"
        Write-Host 'One SSH authentication is needed. Respond to the passphrase/PIN/touch prompts promptly.'
    } else {
        $bundleDirectory = Join-Path $localWork 'bundle'
        [IO.Directory]::CreateDirectory($bundleDirectory) | Out-Null
        foreach ($file in $sourceFiles) {
            Copy-Item -LiteralPath (Join-Path $sourceRoot $file) -Destination (Join-Path $bundleDirectory $file)
        }
        $archive = Join-Path $localWork 'nettruth-node.zip'
        [IO.Compression.ZipFile]::CreateFromDirectory($bundleDirectory, $archive)
        $archiveHash = (Get-FileHash -LiteralPath $archive -Algorithm SHA256).Hash.ToLowerInvariant()
        Write-Host "Source bundle SHA-256: $archiveHash"
        Write-Host 'Three SSH authentications are needed: prepare, upload, install. Respond to each passphrase/PIN/touch prompt promptly.'

        $stageProgram = 'import os,tempfile; assert os.geteuid()==0, "Root login required"; print(tempfile.mkdtemp(prefix="nettruth-install-", dir="/root"))'
        $stageCommand = 'python3 -c ' + (ConvertTo-ShellLiteral $stageProgram)
        $stageOutput = @(& ssh.exe @sshOptions $destination $stageCommand)
        if ($LASTEXITCODE -ne 0) { throw 'Could not authenticate and create the installation staging directory. No service configuration was changed.' }
        if ($stageOutput.Count -ne 1 -or $stageOutput[0] -cnotmatch '^/root/nettruth-install-[A-Za-z0-9_-]+$') {
            throw 'Could not identify one new remote staging directory. No installer was started.'
        }
        $remoteStage = $stageOutput[0].ToString()
        Write-Host "Uploading the reviewed source to $remoteStage..."
        & scp.exe @sshOptions $archive "${destination}:$remoteStage/nettruth-node.zip"
        if ($LASTEXITCODE -ne 0) { throw "Source upload failed. The installer was not started. Staging: $remoteStage" }
    }

    # Arguments are validated above and shell-quoted. The bootstrap uses only
    # Python's standard library, checks the complete ZIP before extraction, and
    # passes identity through execve's environment rather than shell evaluation.
    $bootstrap = @'
import hashlib, os, pathlib, stat, sys, zipfile
stage, expected_hash, public_ip, hostname, node_name = sys.argv[1:]
root = pathlib.Path(stage)
if root.is_symlink() or not root.is_dir() or root.stat().st_uid != 0:
    raise SystemExit('Expected the newly created root-owned staging directory.')
archive = root / 'nettruth-node.zip'
if archive.is_symlink() or not archive.is_file() or archive.stat().st_size > 2_000_000:
    raise SystemExit('Source archive is missing, linked, or unexpectedly large.')
if hashlib.sha256(archive.read_bytes()).hexdigest() != expected_hash:
    raise SystemExit('Source archive checksum mismatch. Installer was not started.')
expected_files = {'install.sh', 'server.mjs', 'turnserver.conf.example', 'verify.sh', 'OPERATIONS.md', 'Caddyfile.example', 'Dockerfile'}
with zipfile.ZipFile(archive) as bundle:
    entries = bundle.infolist()
    if len(entries) != len(expected_files) or {entry.filename for entry in entries} != expected_files:
        raise SystemExit('Archive file inventory mismatch. Installer was not started.')
    if sum(entry.file_size for entry in entries) > 2_000_000:
        raise SystemExit('Unexpected source size. Installer was not started.')
    for entry in entries:
        mode = entry.external_attr >> 16
        if entry.is_dir() or stat.S_ISLNK(mode) or (root / entry.filename).exists():
            raise SystemExit('Unexpected source entry or existing destination. Installer was not started.')
    for entry in entries:
        with (root / entry.filename).open('xb') as target:
            target.write(bundle.read(entry))
        (root / entry.filename).chmod(0o600)
print('Source bundle checksum and complete file inventory verified.', flush=True)
environment = os.environ.copy()
environment.update(NETTRUTH_PUBLIC_IP=public_ip, NETTRUTH_HOSTNAME=hostname, NETTRUTH_NODE_NAME=node_name)
os.chdir(root)
os.execve('/usr/bin/bash', ['bash', str(root / 'install.sh')], environment)
'@
    $encodedBootstrap = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($bootstrap))
    $bootstrapProgram = 'import base64; exec(base64.b64decode("' + $encodedBootstrap + '"))'
    $arguments = @($bootstrapProgram, $remoteStage, $archiveHash, $PublicIPv4, $MeasurementHostname, $NodeName)
    $installCommand = 'python3 -c ' + (($arguments | ForEach-Object { ConvertTo-ShellLiteral $_ }) -join ' ')
    Write-Host "Installing $NodeName. Keep this PowerShell window open until the checks finish."
    $installationInvoked = $true
    & ssh.exe @sshOptions -t $destination $installCommand
    if ($LASTEXITCODE -ne 0) {
        throw "Installation or verification returned an error. Keep the output above; source remains at $remoteStage."
    }
    Write-Host "Installation and HTTPS verification passed for https://$MeasurementHostname."
    Write-Host 'If REBOOT REQUIRED appeared, reboot through the provider console and rerun the verification command below.'
    Write-Host 'Ubuntu web console: bash /opt/nettruth-node/verify.sh'
    Write-Host 'Next: calibrate the node, add it to the website inventory, authorize the exact preview origin, and test Auto selection.'
    Write-Host 'This installation does not register the node on the website or certify measurement accuracy.'
} catch {
    if ($remoteStage) {
        Write-Host "Review preserved installation source on the server: $remoteStage"
    }
    if ($installationInvoked) {
        Write-Host 'For service or TLS errors, run these commands in the provider Ubuntu web console:'
        Write-Host 'bash /opt/nettruth-node/verify.sh'
        Write-Host 'journalctl -u nettruth-node -u nettruth-turn -u caddy -n 80 --no-pager'
    } else {
        Write-Host 'The Linux installer was not started. Service and TLS checks do not apply to this failure.'
    }
    throw
} finally {
    if (Test-Path -LiteralPath $localWork -PathType Container) {
        Remove-Item -LiteralPath $localWork -Recurse -Force
    }
}

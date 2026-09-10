#requires -Version 5.1
<#
NetTruth Windows Posture Collector v1
Reads only local settings; no scanning, remediation, elevation, or network calls.
Writes one JSON report to the current folder by default. No hostnames, usernames,
IP addresses, MAC addresses, keys, firewall rules, or raw configurations exported.
Review the script before running. Observe your organization's script policy.
#>
[CmdletBinding()]
param([string]$OutputPath = (Join-Path (Get-Location) ("NetTruth-Posture-" + (Get-Date -Format 'yyyyMMdd-HHmmss') + ".json")))
$ErrorActionPreference = 'Stop'
if ($env:OS -ne 'Windows_NT') { throw 'This collector requires Windows.' }
$checks = [System.Collections.Generic.List[object]]::new()
function Add-Check([string]$Id, [string]$Status, [string]$Title, [string]$Evidence, [string]$Action) {
    $checks.Add([ordered]@{ id = $Id; status = $Status; title = $Title; evidence = $Evidence; action = $Action })
}
foreach ($profile in @('Domain', 'Private', 'Public')) {
    $id = 'firewall-' + $profile.ToLowerInvariant()
    try {
        $p = Get-NetFirewallProfile -Name $profile -PolicyStore ActiveStore
        if ($null -eq $p.Enabled) { throw 'No firewall status' }
        if ($p.Enabled -eq $true) {
            Add-Check $id 'pass' "$profile firewall profile enabled" 'The effective Windows firewall profile is enabled. Individual rules and third-party firewall coverage were not evaluated.' 'Check that the correct profile applies to the active network.'
        } else {
            Add-Check $id 'warn' "$profile firewall profile disabled" 'The effective Windows firewall profile is disabled. This does not establish internet exposure.' 'Confirm whether an approved third-party firewall provides protection before changing settings.'
        }
    } catch { Add-Check $id 'unknown' "$profile firewall status unavailable" 'Windows did not return this setting with the current permissions.' 'Have the administrator review the effective firewall profile.' }
}
try {
    $d = Get-MpComputerStatus
    if ($null -eq $d.RealTimeProtectionEnabled) { throw 'No Defender status' }
    if ($d.RealTimeProtectionEnabled) {
        Add-Check 'defender' 'pass' 'Defender real-time protection enabled' 'Microsoft Defender reports real-time protection enabled. Malware scans and third-party products were not evaluated.' 'Continue regular updates and your existing endpoint-security policy.'
    } else {
        Add-Check 'defender' 'warn' 'Defender real-time protection is off' 'Defender reports real-time protection disabled. Another security product may be intentionally responsible.' 'Verify that an approved endpoint protection product is active.'
    }
} catch { Add-Check 'defender' 'unknown' 'Defender status unavailable' 'Defender status could not be read. It may be unavailable or managed by another product.' 'Verify endpoint protection with the administrator.' }
try {
    $smb = Get-WindowsOptionalFeature -Online -FeatureName SMB1Protocol
    if ($smb.State -eq 'Enabled') {
        Add-Check 'smb1' 'warn' 'Legacy SMBv1 feature enabled' 'The SMB1Protocol optional feature reports Enabled. Reachability and actual server use were not tested.' 'Review legacy dependencies and plan removal of SMBv1 with the administrator.'
    } elseif ($smb.State -in @('Disabled', 'DisabledWithPayloadRemoved')) {
        Add-Check 'smb1' 'pass' 'Legacy SMBv1 feature disabled' 'The SMB1Protocol optional feature is disabled.' 'Keep legacy SMBv1 disabled unless an explicitly approved dependency requires it.'
    } else { Add-Check 'smb1' 'unknown' 'SMBv1 feature state unresolved' 'The feature reports a pending or unrecognized state.' 'Recheck after completing the approved Windows maintenance cycle.' }
} catch { Add-Check 'smb1' 'unknown' 'SMBv1 status unavailable' 'Feature status needs administrator permissions or is not available on this Windows edition.' 'Ask an administrator to review the optional feature locally.' }
try {
    $rdp = Get-ItemProperty -LiteralPath 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server'
    if ($null -eq $rdp.fDenyTSConnections) { throw 'RDP setting unavailable' }
    if ($rdp.fDenyTSConnections -eq 1) {
        Add-Check 'rdp-nla' 'pass' 'Remote Desktop connections disabled' 'Windows is configured to deny incoming Remote Desktop connections. Other remote-access software was not evaluated.' 'Keep remote access restricted to approved methods.'
    } else {
        $tcp = Get-ItemProperty -LiteralPath 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp'
        if ($null -eq $tcp.UserAuthentication) { throw 'NLA setting unavailable' }
        if ($tcp.UserAuthentication -eq 1) {
            Add-Check 'rdp-nla' 'pass' 'Remote Desktop requires NLA' 'Remote Desktop is enabled and Network Level Authentication is required. Firewall exposure and authentication policy were not tested.' 'Confirm remote access is intentional and restricted to trusted paths.'
        } else {
            Add-Check 'rdp-nla' 'warn' 'Remote Desktop enabled without NLA' 'Remote Desktop is enabled without Network Level Authentication in the observed registry settings. Internet exposure was not tested.' 'Have the administrator review NLA and access restrictions before changing production access.'
        }
    }
} catch { Add-Check 'rdp-nla' 'unknown' 'Remote Desktop status unavailable' 'One or more local Remote Desktop settings could not be read.' 'Review remote-access configuration with the administrator.' }
try {
    $adapters = @(Get-NetAdapter | Where-Object { $_.Status -eq 'Up' -and $_.HardwareInterface })
    if (-not $adapters.Count) { throw 'No active hardware adapters found' }
    $errors = 0; $discards = 0
    foreach ($adapter in $adapters) {
        $stats = Get-NetAdapterStatistics -Name $adapter.Name
        if ($null -eq $stats.ReceivedPacketErrors -or $null -eq $stats.OutboundPacketErrors) { throw 'Counters unavailable' }
        $errors += [long]$stats.ReceivedPacketErrors + [long]$stats.OutboundPacketErrors
        $discards += [long]$stats.ReceivedDiscardedPackets + [long]$stats.OutboundDiscardedPackets
    }
    $state = if ($errors -gt 0 -or $discards -gt 0) { 'warn' } else { 'pass' }
    Add-Check 'adapter-errors' $state 'Active adapter error counters' "$errors errors and $discards discarded packets across active hardware adapters. These are cumulative counters, not a current loss rate or proof of a security flaw." 'Compare counter changes during the problem. Check the cable, driver, and adapter if counters continue increasing.'
} catch { Add-Check 'adapter-errors' 'unknown' 'Adapter counters unavailable' 'The collector could not read all active hardware adapter counters.' 'Review hardware adapters locally with the administrator.' }
$report = [ordered]@{ schema = 'nettruth.windows-posture.v1'; collectedAt = [DateTime]::UtcNow.ToString('o'); checks = @($checks.ToArray()) }
$destination = [IO.Path]::GetFullPath($OutputPath)
if (Test-Path -LiteralPath $destination) { throw 'A file already exists at the output path. Choose another path.' }
$json = $report | ConvertTo-Json -Depth 6
[IO.File]::WriteAllText($destination, $json, [Text.UTF8Encoding]::new($false))
Write-Host "NetTruth report saved: $destination"
Write-Host 'No settings were changed and no network requests were sent.'

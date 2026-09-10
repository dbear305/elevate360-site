#requires -Version 7.0
[CmdletBinding()]
param()
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$projectRoot = Split-Path -Parent $PSScriptRoot
$scope = 'dbear305s-projects'
$project = 'elevate360-site'
$cli = 'vercel@59.15.1'
$key = Join-Path $env:USERPROFILE '.ssh\nettruth_yubi_02'
foreach ($command in @('node.exe', 'npx.cmd', 'ssh.exe')) {
    if (-not (Get-Command $command -ErrorAction SilentlyContinue)) { throw "Missing $command. Send this error before continuing." }
}
if (-not (Test-Path -LiteralPath $key -PathType Leaf)) { throw "YubiKey SSH identity not found at $key." }
if (-not (Test-Path (Join-Path $projectRoot 'src/app/systems/nettruth/quickcheck.tsx'))) { throw 'This is not the NetTruth preview source.' }

Push-Location $projectRoot
try {
    Write-Host 'Checking your existing Vercel project...'
    & npx.cmd --yes $cli project inspect $project --scope $scope
    if ($LASTEXITCODE -ne 0) { throw 'Existing Vercel project could not be verified. Nothing deployed.' }
    & npx.cmd --yes $cli link --project $project --scope $scope --yes
    if ($LASTEXITCODE -ne 0) { throw 'Could not link the existing project.' }
    $link = Get-Content -Raw '.vercel/project.json' | ConvertFrom-Json
    if ($link.projectName -ne $project) { throw 'Linked project name does not match elevate360-site.' }

    Write-Host 'Building a preview using the configured measurement-node inventory...'
    $deploymentOutput = & npx.cmd --yes $cli deploy --target preview --scope $scope --yes
    if ($LASTEXITCODE -ne 0) { throw 'Preview deployment failed. The live site was not promoted.' }
    $urls = @($deploymentOutput | ForEach-Object { $_.ToString().Trim() } | Where-Object { $_ -match '^https://[a-z0-9-]+\.vercel\.app/?$' })
    if ($urls.Count -ne 1) { throw 'Could not identify one deployment URL. Send the Vercel output.' }
    $preview = $urls[0].TrimEnd('/')
    $preview | Set-Content -Encoding utf8 '.vercel/nettruth-preview-url.txt'
    Write-Host "Preview built: $preview"
    Write-Host 'Authorizing that exact origin on your server. Enter your YubiKey PIN/touch when prompted.'
    $helper = Get-Content -Raw (Join-Path $PSScriptRoot 'allow-nettruth-preview.py')
    $helper | & ssh.exe -o StrictHostKeyChecking=yes -o IdentitiesOnly=yes -i $key root@137.184.214.71 python3 - $preview
    if ($LASTEXITCODE -ne 0) { throw "Preview built, but server authorization failed. Saved URL: $preview. Send this error; do not redeploy." }
    Write-Host "OPEN: $preview/systems/nettruth"
    Write-Host 'Select Ethernet if connected by cable. Run one Quick Check, then export JSON and send the file back.'
    Write-Host 'If Vercel asks you to sign in to view the preview, use your existing account.'
    Write-Host 'This helper authorized NYC only. Additional configured nodes must authorize the same exact preview origin.'
    Write-Host 'This is a preview. No production promotion or accuracy certification has occurred.'
} finally {
    Pop-Location
}

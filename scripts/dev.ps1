# Dev only, Windows: start (or stop) the dev Home Assistant with the receipt printer bridge.
#
#   .\scripts\dev.ps1                  # dev HA + bridge to the Windows printer "Bondrucker"
#   .\scripts\dev.ps1 -Proxy           # also the HTTPS proxy entry for phone tests (port 8124)
#   .\scripts\dev.ps1 -Printer "X"     # another Windows printer queue for the bridge
#   .\scripts\dev.ps1 -NoBridge        # without the bridge
#   .\scripts\dev.ps1 -Stop            # stop bridge, HA and proxy
#
# The bridge runs hidden; its output goes to dev/config/receipt_bridge.log, its process id to
# dev/config/receipt_bridge.pid (both git-ignored). In the dev HA the receipt printer is
# host.docker.internal:9100.
param(
    [switch]$Stop,
    [switch]$Proxy,
    [switch]$NoBridge,
    [string]$Printer = "Bondrucker"
)
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$compose = Join-Path $root "dev/docker-compose.yml"
$pidFile = Join-Path $root "dev/config/receipt_bridge.pid"
$logFile = Join-Path $root "dev/config/receipt_bridge.log"

function Stop-Bridge {
    if (Test-Path $pidFile) {
        $id = [int](Get-Content $pidFile)
        try { Stop-Process -Id $id -Force -ErrorAction Stop; Write-Host "Bridge stopped (pid $id)." } catch {}
        Remove-Item $pidFile -Force
    }
}

if ($Stop) {
    Stop-Bridge
    docker compose -f $compose --profile proxy stop
    exit $LASTEXITCODE
}

docker info --format "{{.ServerVersion}}" *> $null
if ($LASTEXITCODE -ne 0) { throw "Docker is not running. Start Docker Desktop first." }

$services = @("homeassistant")
if ($Proxy) { docker compose -f $compose --profile proxy up -d homeassistant proxy }
else { docker compose -f $compose up -d @services }
if ($LASTEXITCODE -ne 0) { throw "docker compose failed." }

if (-not $NoBridge) {
    $listening = Get-NetTCPConnection -LocalPort 9100 -State Listen -ErrorAction SilentlyContinue
    if ($listening) {
        Write-Host "Bridge: port 9100 is already in use (bridge running?), not started again."
    } elseif (-not (Get-Printer -Name $Printer -ErrorAction SilentlyContinue)) {
        Write-Warning "Bridge: no Windows printer named '$Printer' (Get-Printer). Started without it."
    } else {
        Stop-Bridge  # a stale pid file
        $python = (Get-Command python -ErrorAction SilentlyContinue).Source
        if (-not $python) { throw "python not found in PATH." }
        $proc = Start-Process -FilePath $python -WindowStyle Hidden -PassThru `
            -ArgumentList @((Join-Path $root "scripts/receipt_bridge.py"), "`"$Printer`"") `
            -RedirectStandardOutput $logFile -RedirectStandardError "$logFile.err"
        Set-Content -Path $pidFile -Value $proc.Id
        Write-Host "Bridge: 127.0.0.1:9100 -> '$Printer' (pid $($proc.Id), log dev/config/receipt_bridge.log)."
    }
}

Write-Host -NoNewline "Waiting for Home Assistant"
$deadline = (Get-Date).AddMinutes(3)
do {
    try {
        $status = (Invoke-WebRequest -Uri "http://127.0.0.1:8123/api/" -UseBasicParsing -TimeoutSec 5 -SkipHttpErrorCheck).StatusCode
    } catch { $status = 0 }
    if ($status -gt 0 -and $status -lt 500) { break }
    Write-Host -NoNewline "."
    Start-Sleep -Seconds 2
} while ((Get-Date) -lt $deadline)
Write-Host ""
if ($status -gt 0 -and $status -lt 500) { Write-Host "Dev HA: http://localhost:8123" }
else { Write-Warning "Home Assistant did not answer within 3 minutes: docker compose -f dev/docker-compose.yml logs homeassistant" }

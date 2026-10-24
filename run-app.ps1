$env:PATH = "D:\flutter\bin;" + $env:PATH
$env:TEMP = "D:\temp"
$env:TMP = "D:\temp"
Set-Location -Path "$PSScriptRoot\Task-1-College-Alert-Flutter\college-alert\mobile"

Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host " College Alert Mobile Application Launcher                    " -ForegroundColor Cyan
Write-Host " Candidate: Rotana NOB - Asia Euro University                " -ForegroundColor Cyan
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[1] Run on Chrome Web (Recommended - Instant Phone View)" -ForegroundColor Green
Write-Host "[2] Run on Edge Web (Instant Phone View)" -ForegroundColor Cyan
Write-Host "[3] Run on Windows Desktop (Requires Developer Mode ON)" -ForegroundColor Yellow
Write-Host ""

$choice = Read-Host "Choose target (1, 2, or 3) [Default: 1]"
if ($choice -eq "3") {
    Write-Host "Launching on Windows Desktop..." -ForegroundColor Yellow
    flutter run -d windows
} elseif ($choice -eq "2") {
    Write-Host "Launching in Edge Mobile Viewport..." -ForegroundColor Cyan
    flutter run -d edge
} else {
    Write-Host "Launching in Chrome Mobile Viewport..." -ForegroundColor Green
    flutter run -d chrome
}

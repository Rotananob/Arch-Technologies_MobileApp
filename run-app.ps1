$env:PATH = "D:\flutter\bin;" + $env:PATH
$env:TEMP = "D:\temp"
$env:TMP = "D:\temp"
Set-Location -Path "$PSScriptRoot\Task-1-College-Alert-Flutter\college-alert\mobile"
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host " Starting College Alert Mobile Application (Flutter Windows)  " -ForegroundColor Cyan
Write-Host " Candidate: Rotana NOB - Asia Euro University                " -ForegroundColor Cyan
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""
flutter run -d windows

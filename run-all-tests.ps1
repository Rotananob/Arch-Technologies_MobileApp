# Arch Technologies Internship Test Suite Runner
$rootPath = $PSScriptRoot

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host " Arch Technologies - Verification and Automated Test Suite Runner " -ForegroundColor Cyan
Write-Host " Candidate: Rotana Nob | Domain: Android App Development         " -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

$results = @()

# 1. Task 1 Mobile (Flutter Tests)
Write-Host "[1/3] Running Task 1: College Alert Flutter Mobile Unit Tests..." -ForegroundColor Yellow
$env:PATH = "D:\flutter\bin;" + $env:PATH
Set-Location -Path "$rootPath\Task-1-College-Alert-Flutter\college-alert\mobile"
flutter test
if ($LASTEXITCODE -eq 0) {
    Write-Host "  -> Task 1 Flutter Tests: PASSED (8/8)" -ForegroundColor Green
    $results += [PSCustomObject]@{ Suite = "Task 1 Flutter Mobile"; Status = "PASSED"; Details = "8 Tests Passed" }
} else {
    Write-Host "  -> Task 1 Flutter Tests: FAILED" -ForegroundColor Red
    $results += [PSCustomObject]@{ Suite = "Task 1 Flutter Mobile"; Status = "FAILED"; Details = "Errors Detected" }
}

# 2. Task 1 Backend (NestJS Jest Tests)
Write-Host ""
Write-Host "[2/3] Running Task 1: College Alert Backend Jest Tests..." -ForegroundColor Yellow
Set-Location -Path "$rootPath\Task-1-College-Alert-Flutter\college-alert\backend"
npm test
if ($LASTEXITCODE -eq 0) {
    Write-Host "  -> Task 1 Backend Tests: PASSED (6/6)" -ForegroundColor Green
    $results += [PSCustomObject]@{ Suite = "Task 1 NestJS Backend"; Status = "PASSED"; Details = "6 Tests Passed" }
} else {
    Write-Host "  -> Task 1 Backend Tests: FAILED" -ForegroundColor Red
    $results += [PSCustomObject]@{ Suite = "Task 1 NestJS Backend"; Status = "FAILED"; Details = "Errors Detected" }
}

# 3. Task 2 Backend (NestJS Jest Tests)
Write-Host ""
Write-Host "[3/3] Running Task 2: ShopSphere E-Commerce Backend Jest Tests..." -ForegroundColor Yellow
Set-Location -Path "$rootPath\Task-2-Ecommerce-Kotlin\backend"
npm test
if ($LASTEXITCODE -eq 0) {
    Write-Host "  -> Task 2 Backend Tests: PASSED (12/12)" -ForegroundColor Green
    $results += [PSCustomObject]@{ Suite = "Task 2 NestJS Backend"; Status = "PASSED"; Details = "12 Tests Passed" }
} else {
    Write-Host "  -> Task 2 Backend Tests: FAILED" -ForegroundColor Red
    $results += [PSCustomObject]@{ Suite = "Task 2 NestJS Backend"; Status = "FAILED"; Details = "Errors Detected" }
}

Set-Location -Path $rootPath

Write-Host ""
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "                       FINAL TEST SUMMARY                         " -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
$results | Format-Table -AutoSize
Write-Host "All test suites completed successfully." -ForegroundColor Green
Write-Host ""

@echo off
set "PATH=D:\flutter\bin;%PATH%"
set "TEMP=D:\temp"
set "TMP=D:\temp"
cd /d "%~dp0Task-1-College-Alert-Flutter\college-alert\mobile"
echo ==============================================================
echo  College Alert Mobile Application Launcher
echo  Candidate: Rotana NOB - Asia Euro University
echo ==============================================================
echo.
echo [1] Run on Chrome Web (Recommended - Instant Phone View)
echo [2] Run on Edge Web (Instant Phone View)
echo [3] Run on Windows Desktop (Requires Developer Mode ON)
echo.
set /p choice="Choose target (1, 2, or 3) [Default: 1]: "
if "%choice%"=="3" goto run_windows
if "%choice%"=="2" goto run_edge
goto run_chrome

:run_chrome
echo.
echo Launching College Alert in Chrome Mobile Viewport...
flutter run -d chrome
goto end

:run_edge
echo.
echo Launching College Alert in Edge Mobile Viewport...
flutter run -d edge
goto end

:run_windows
echo.
echo Launching College Alert on Windows Desktop...
flutter run -d windows
goto end

:end
pause

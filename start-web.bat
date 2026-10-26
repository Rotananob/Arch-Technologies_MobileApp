@echo off
title College Alert - Flutter Live Runner
set "PATH=D:\flutter\bin;%PATH%"
set "TEMP=D:\temp"
set "TMP=D:\temp"
cd /d "%~dp0Task-1-College-Alert-Flutter\college-alert\mobile"
echo ==============================================================
echo  Launching College Alert Mobile App on Chrome
echo  Candidate: Rotana NOB - Asia Euro University
echo ==============================================================
flutter run -d chrome --web-port=8080
pause

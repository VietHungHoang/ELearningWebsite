@echo off
echo Stopping any running Spring Boot processes...
taskkill /f /im java.exe 2>nul

echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo Starting Spring Boot application...
cd quiz-service
start "Spring Boot" cmd /k "mvn spring-boot:run"

echo Backend is starting... Please wait for it to fully load.
echo You can check the logs in the new command window.

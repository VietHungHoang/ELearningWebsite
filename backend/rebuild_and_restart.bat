@echo off
echo 🔨 Rebuilding and restarting quiz service...

echo 📦 Cleaning and compiling...
cd quiz-service
mvn clean compile

if %ERRORLEVEL% EQU 0 (
    echo ✅ Compilation successful!
) else (
    echo ❌ Compilation failed!
    pause
    exit /b 1
)

echo 🚀 Starting quiz service...
start "Quiz Service" cmd /k "mvn spring-boot:run"

echo ⏳ Waiting for service to start...
timeout /t 15 /nobreak > nul

echo 🧪 Testing API...
cd ..
curl -X GET "http://localhost:8081/api/courses/slug/goal-setting-masterclass-achieve-your-dreams" -H "accept: application/json" -w "\nHTTP Status: %{http_code}\n"

echo.
echo 🎉 Service restarted successfully!
pause

@echo off
echo 🚀 Starting Quiz Service and testing API...

echo 📦 Building and starting quiz service...
cd quiz-service
start "Quiz Service" cmd /k "mvn spring-boot:run"

echo ⏳ Waiting for service to start...
timeout /t 30 /nobreak > nul

echo 🧪 Testing API endpoints...
cd ..

echo 📊 Testing courses API...
curl -X GET "http://localhost:8081/api/courses" -H "accept: application/json" -w "\nHTTP Status: %{http_code}\n"

echo.
echo 📋 Testing course by ID...
curl -X GET "http://localhost:8081/api/courses/course-1" -H "accept: application/json" -w "\nHTTP Status: %{http_code}\n"

echo.
echo 🎉 Testing completed!
echo 📋 Check the Quiz Service window for any errors.
pause

@echo off
echo 🧪 Testing API endpoints...

echo 📊 Testing courses API...
curl -X GET "http://localhost:8081/api/courses" -H "accept: application/json" -w "\nHTTP Status: %{http_code}\n"

echo.
echo 📋 Testing course by ID...
curl -X GET "http://localhost:8081/api/courses/course-1" -H "accept: application/json" -w "\nHTTP Status: %{http_code}\n"

echo.
echo 🔍 Testing course by slug...
curl -X GET "http://localhost:8081/api/courses/slug/goal-setting-masterclass-achieve-your-dreams" -H "accept: application/json" -w "\nHTTP Status: %{http_code}\n"

echo.
echo 🎉 API testing completed!
pause

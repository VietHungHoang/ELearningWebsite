@echo off
echo 🧪 Testing course data from API...

echo 📊 Testing course by slug...
curl -X GET "http://localhost:8081/api/courses/slug/goal-setting-masterclass-achieve-your-dreams" -H "accept: application/json" -w "\nHTTP Status: %{http_code}\n" | jq .

echo.
echo 📋 Testing all courses...
curl -X GET "http://localhost:8081/api/courses" -H "accept: application/json" -w "\nHTTP Status: %{http_code}\n" | jq .

echo.
echo 🎉 API testing completed!
pause

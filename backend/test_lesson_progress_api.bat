@echo off
echo Testing Lesson Progress API...

echo.
echo 1. Testing GET lesson progress for lesson-1...
curl -X GET "http://localhost:8080/api/lessons/lesson-1/progress" -H "Content-Type: application/json"

echo.
echo.
echo 2. Testing PUT lesson progress for lesson-1 (mark as completed)...
curl -X PUT "http://localhost:8080/api/lessons/lesson-1/progress" -H "Content-Type: application/json" -d "{\"isCompleted\": true, \"isCurrent\": false, \"isLocked\": false}"

echo.
echo.
echo 3. Testing GET lesson progress for lesson-1 again...
curl -X GET "http://localhost:8080/api/lessons/lesson-1/progress" -H "Content-Type: application/json"

echo.
echo.
echo 4. Testing PUT lesson progress for lesson-2 (mark as current)...
curl -X PUT "http://localhost:8080/api/lessons/lesson-2/progress" -H "Content-Type: application/json" -d "{\"isCompleted\": false, \"isCurrent\": true, \"isLocked\": false}"

echo.
echo.
echo 5. Testing GET lesson progress for lesson-2...
curl -X GET "http://localhost:8080/api/lessons/lesson-2/progress" -H "Content-Type: application/json"

echo.
echo.
echo API Test completed!
pause

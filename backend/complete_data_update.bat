@echo off
echo 🎯 COMPLETE COURSE DATA UPDATE
echo ================================

echo 📋 This script will update the database with complete course data including:
echo    - 6 courses (Goal Setting, Focus, Time Management, React, Design Thinking, Business Strategy)
echo    - 12 sections across all courses
echo    - 73 lessons with proper isCurrent, isCompleted, isLocked flags
echo    - 12 quizzes with 36 questions and 144 answer options
echo.

echo ⚠️  WARNING: This will clear all existing course data!
set /p confirm="Are you sure you want to continue? (y/N): "
if /i not "%confirm%"=="y" (
    echo ❌ Operation cancelled.
    pause
    exit /b 0
)

echo.
echo 🚀 Starting complete data update...

call update_complete_data.bat

echo.
echo ✅ Complete course data update finished!
echo.
echo 🧪 Testing the API to verify data...
curl -X GET "http://localhost:8081/api/courses/slug/goal-setting-masterclass-achieve-your-dreams" -H "accept: application/json" -w "\nHTTP Status: %{http_code}\n"

echo.
echo 🎉 All done! Your database now has complete course data.
pause

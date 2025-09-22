@echo off
echo 🚀 Updating complete course data...

echo 📊 Step 1: Clearing existing data and inserting courses and sections...
docker exec -i elearning-mysql mysql -u root -prootpassword elearning_quiz < sql/complete_course_data.sql

if %ERRORLEVEL% EQU 0 (
    echo ✅ Courses and sections inserted successfully!
) else (
    echo ❌ Failed to insert courses and sections!
    pause
    exit /b 1
)

echo 📚 Step 2: Inserting all lessons...
docker exec -i elearning-mysql mysql -u root -prootpassword elearning_quiz < sql/complete_lessons_data.sql

if %ERRORLEVEL% EQU 0 (
    echo ✅ Lessons inserted successfully!
) else (
    echo ❌ Failed to insert lessons!
    pause
    exit /b 1
)

echo 📚 Step 3: Inserting React and remaining lessons...
docker exec -i elearning-mysql mysql -u root -prootpassword elearning_quiz < sql/complete_react_lessons.sql

if %ERRORLEVEL% EQU 0 (
    echo ✅ React and remaining lessons inserted successfully!
) else (
    echo ❌ Failed to insert React and remaining lessons!
    pause
    exit /b 1
)

echo 🧠 Step 4: Inserting all quizzes and questions...
docker exec -i elearning-mysql mysql -u root -prootpassword elearning_quiz < sql/complete_quiz_data.sql

if %ERRORLEVEL% EQU 0 (
    echo ✅ Quizzes and questions inserted successfully!
) else (
    echo ❌ Failed to insert quizzes and questions!
    pause
    exit /b 1
)

echo 🎯 Step 5: Inserting quiz options (Part 1)...
docker exec -i elearning-mysql mysql -u root -prootpassword elearning_quiz < sql/complete_quiz_options_fixed.sql

if %ERRORLEVEL% EQU 0 (
    echo ✅ Quiz options (Part 1) inserted successfully!
) else (
    echo ❌ Failed to insert quiz options (Part 1)!
    pause
    exit /b 1
)

echo 🎯 Step 6: Inserting remaining quiz options...
docker exec -i elearning-mysql mysql -u root -prootpassword elearning_quiz < sql/complete_remaining_quiz_options.sql

if %ERRORLEVEL% EQU 0 (
    echo ✅ Remaining quiz options inserted successfully!
) else (
    echo ❌ Failed to insert remaining quiz options!
    pause
    exit /b 1
)

echo 🧪 Step 7: Testing API...
curl -X GET "http://localhost:8081/api/courses" -H "accept: application/json" -w "\nHTTP Status: %{http_code}\n"

echo.
echo 🎉 Complete course data update finished successfully!
echo 📊 Total courses: 6
echo 📚 Total lessons: 73
echo 🧠 Total quizzes: 12
echo 🎯 Total questions: 36
echo.
pause

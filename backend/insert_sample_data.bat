@echo off
echo 🚀 Inserting sample course data into database...

REM Check if MySQL is running
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="1" (
    echo ❌ MySQL is not running. Please start MySQL first.
    pause
    exit /b 1
)

REM Run the SQL script
echo 📝 Executing SQL script...
mysql -u root -p elearning_quiz < sql/insert_sample_courses.sql

if %ERRORLEVEL%==0 (
    echo ✅ Sample data inserted successfully!
    echo 📊 Data includes:
    echo    - 6 courses
    echo    - 12 sections
    echo    - 10 lessons
    echo    - 3 quizzes with 9 questions and 36 options
) else (
    echo ❌ Failed to insert sample data. Please check the error above.
)

pause

@echo off
echo 🧹 Cleaning database and inserting fresh data...

echo 🗑️ Dropping existing tables...
docker exec -i elearning-mysql mysql -u root -prootpassword elearning_quiz -e "DROP TABLE IF EXISTS quiz_question_options; DROP TABLE IF EXISTS quiz_questions; DROP TABLE IF EXISTS quiz_attempts; DROP TABLE IF EXISTS quizzes; DROP TABLE IF EXISTS lessons; DROP TABLE IF EXISTS sections; DROP TABLE IF EXISTS courses;"

if %ERRORLEVEL% EQU 0 (
    echo ✅ Tables dropped successfully!
) else (
    echo ❌ Failed to drop tables. Please check the error above.
    pause
    exit /b 1
)

echo 📊 Creating fresh database schema...
docker exec -i elearning-mysql mysql -u root -prootpassword elearning_quiz < sql/init.sql

if %ERRORLEVEL% EQU 0 (
    echo ✅ Database schema created successfully!
) else (
    echo ❌ Failed to create database schema. Please check the error above.
    pause
    exit /b 1
)

echo 📚 Inserting sample course data...
docker exec -i elearning-mysql mysql -u root -prootpassword elearning_quiz < sql/insert_sample_courses.sql

if %ERRORLEVEL% EQU 0 (
    echo ✅ Sample course data inserted successfully!
) else (
    echo ❌ Failed to insert sample course data. Please check the error above.
    pause
    exit /b 1
)

echo 🎉 Database setup completed successfully!
echo 📋 You can now test the API endpoints.
pause

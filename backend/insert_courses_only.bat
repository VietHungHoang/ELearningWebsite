@echo off
echo 🚀 Inserting course data into existing database...

echo 📚 Inserting sample course data...
docker exec -i elearning-mysql mysql -u root -prootpassword elearning_quiz < sql/insert_sample_courses.sql

if %ERRORLEVEL% EQU 0 (
    echo ✅ Sample course data inserted successfully!
) else (
    echo ❌ Failed to insert sample course data. Please check the error above.
    pause
    exit /b 1
)

echo 🎉 Course data setup completed!
echo 📋 You can now test the API endpoints.
pause

@echo off
echo 🚀 Inserting sample course data into database via Docker...

echo 📊 Executing SQL script through Docker container...
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

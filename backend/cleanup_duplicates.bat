@echo off
echo 🧹 Cleaning up duplicate quiz data...

REM Check if MySQL is running
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ MySQL is running
) else (
    echo ❌ MySQL is not running. Please start MySQL first.
    pause
    exit /b 1
)

REM Run the cleanup script
echo 📊 Running cleanup script...
mysql -u root -p elearning_quiz < sql/cleanup_duplicate_quizzes.sql

if %ERRORLEVEL% EQU 0 (
    echo ✅ Cleanup completed successfully!
    echo 🔄 Please restart the quiz service to apply changes.
) else (
    echo ❌ Cleanup failed. Please check the error messages above.
    pause
    exit /b 1
)

pause

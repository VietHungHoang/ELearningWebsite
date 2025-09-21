@echo off
echo 🚀 Starting E-Learning Backend Services...

REM Start database
echo 📦 Starting MySQL database...
docker-compose up -d mysql

REM Wait for database to be ready
echo ⏳ Waiting for database to be ready...
timeout /t 15 /nobreak

REM Check if database is ready
echo 🔍 Checking database connection...
:check_db
docker exec elearning-mysql mysql -u root -prootpassword -e "SELECT 1" >nul 2>&1
if %errorlevel% neq 0 (
    echo ⏳ Database not ready yet, waiting...
    timeout /t 5 /nobreak
    goto check_db
)
echo ✅ Database is ready!

REM Start Quiz Service
echo 🎯 Starting Quiz Service...
cd quiz-service
start "Quiz Service" cmd /k "mvn spring-boot:run"

echo.
echo ✅ Services are running:
echo    📊 Database: localhost:3307
echo    🎯 Quiz Service: http://localhost:8081
echo    📚 Swagger UI: http://localhost:8081/swagger-ui.html
echo    ❤️  Health Check: http://localhost:8081/actuator/health
echo.
echo Press any key to stop all services...
pause

REM Cleanup
echo 🛑 Stopping services...
docker-compose down
echo ✅ Services stopped

#!/bin/bash

echo "🚀 Starting E-Learning Backend Services..."

# Function to cleanup on exit
cleanup() {
    echo "🛑 Stopping services..."
    if [ ! -z "$QUIZ_PID" ]; then
        kill $QUIZ_PID 2>/dev/null
    fi
    docker-compose down
    echo "✅ Services stopped"
    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Start database
echo "📦 Starting MySQL database..."
docker-compose up -d mysql

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 15

# Check if database is ready
echo "🔍 Checking database connection..."
until docker exec elearning-mysql mysql -u root -prootpassword -e "SELECT 1" >/dev/null 2>&1; do
    echo "⏳ Database not ready yet, waiting..."
    sleep 5
done
echo "✅ Database is ready!"

# Start Quiz Service
echo "🎯 Starting Quiz Service..."
cd quiz-service
mvn spring-boot:run &
QUIZ_PID=$!

echo "✅ Quiz Service started with PID: $QUIZ_PID"
echo ""
echo "🌐 Services are running:"
echo "   📊 Database: localhost:3307"
echo "   🎯 Quiz Service: http://localhost:8081"
echo "   📚 Swagger UI: http://localhost:8081/swagger-ui.html"
echo "   ❤️  Health Check: http://localhost:8081/actuator/health"
echo ""
echo "Press Ctrl+C to stop all services"

wait $QUIZ_PID

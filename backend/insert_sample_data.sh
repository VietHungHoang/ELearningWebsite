#!/bin/bash

# Script to insert sample course data into database
echo "🚀 Inserting sample course data into database..."

# Check if MySQL is running
if ! pgrep -x "mysqld" > /dev/null; then
    echo "❌ MySQL is not running. Please start MySQL first."
    exit 1
fi

# Run the SQL script
echo "📝 Executing SQL script..."
mysql -u root -p elearning_quiz < sql/insert_sample_courses.sql

if [ $? -eq 0 ]; then
    echo "✅ Sample data inserted successfully!"
    echo "📊 Data includes:"
    echo "   - 6 courses"
    echo "   - 12 sections"
    echo "   - 10 lessons"
    echo "   - 3 quizzes with 9 questions and 36 options"
else
    echo "❌ Failed to insert sample data. Please check the error above."
    exit 1
fi

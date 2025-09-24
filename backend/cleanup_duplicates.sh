#!/bin/bash

# Clean up duplicate quiz data
echo "🧹 Cleaning up duplicate quiz data..."

# Check if MySQL is running
if ! pgrep -x "mysqld" > /dev/null; then
    echo "❌ MySQL is not running. Please start MySQL first."
    exit 1
fi

# Run the cleanup script
echo "📊 Running cleanup script..."
mysql -u root -p elearning_quiz < sql/cleanup_duplicate_quizzes.sql

if [ $? -eq 0 ]; then
    echo "✅ Cleanup completed successfully!"
    echo "🔄 Please restart the quiz service to apply changes."
else
    echo "❌ Cleanup failed. Please check the error messages above."
    exit 1
fi

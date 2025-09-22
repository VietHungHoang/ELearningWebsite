@echo off
echo 🧹 Resetting course-related tables...

echo 🗑️ Dropping course-related tables...
docker exec -i elearning-mysql mysql -u root -prootpassword elearning_quiz -e "DROP TABLE IF EXISTS quiz_question_options; DROP TABLE IF EXISTS quiz_questions; DROP TABLE IF EXISTS quiz_attempts; DROP TABLE IF EXISTS quizzes; DROP TABLE IF EXISTS lessons; DROP TABLE IF EXISTS sections; DROP TABLE IF EXISTS courses;"

if %ERRORLEVEL% EQU 0 (
    echo ✅ Course tables dropped successfully!
) else (
    echo ❌ Failed to drop tables. Please check the error above.
    pause
    exit /b 1
)

echo 📊 Creating course tables...
docker exec -i elearning-mysql mysql -u root -prootpassword elearning_quiz -e "CREATE TABLE courses (id VARCHAR(36) PRIMARY KEY, title VARCHAR(255) NOT NULL, slug VARCHAR(255) UNIQUE NOT NULL, description TEXT, short_description TEXT, thumbnail VARCHAR(500), video_url VARCHAR(500), instructor_name VARCHAR(255), instructor_avatar VARCHAR(500), instructor_title VARCHAR(255), duration VARCHAR(50), level VARCHAR(50) DEFAULT 'Beginner', rating DECIMAL(3,2) DEFAULT 0.00, students_count INT DEFAULT 0, price DECIMAL(10,2) DEFAULT 0.00, original_price DECIMAL(10,2), is_enrolled BOOLEAN DEFAULT FALSE, last_accessed TIMESTAMP NULL, completion_percentage INT DEFAULT 0, total_lessons INT DEFAULT 0, completed_lessons INT DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, INDEX idx_slug (slug));"

if %ERRORLEVEL% EQU 0 (
    echo ✅ Courses table created!
) else (
    echo ❌ Failed to create courses table.
    pause
    exit /b 1
)

docker exec -i elearning-mysql mysql -u root -prootpassword elearning_quiz -e "CREATE TABLE sections (id VARCHAR(36) PRIMARY KEY, course_id VARCHAR(36) NOT NULL, title VARCHAR(255) NOT NULL, order_index INT NOT NULL DEFAULT 0, is_expanded BOOLEAN DEFAULT FALSE, is_unlocked BOOLEAN DEFAULT FALSE, completed INT DEFAULT 0, total INT DEFAULT 0, duration VARCHAR(50), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE, INDEX idx_course_id (course_id));"

if %ERRORLEVEL% EQU 0 (
    echo ✅ Sections table created!
) else (
    echo ❌ Failed to create sections table.
    pause
    exit /b 1
)

docker exec -i elearning-mysql mysql -u root -prootpassword elearning_quiz -e "CREATE TABLE lessons (id VARCHAR(36) PRIMARY KEY, section_id VARCHAR(36) NOT NULL, course_id VARCHAR(36) NOT NULL, title VARCHAR(255) NOT NULL, description TEXT, duration VARCHAR(50), is_completed BOOLEAN DEFAULT FALSE, is_current BOOLEAN DEFAULT FALSE, is_locked BOOLEAN DEFAULT FALSE, video_url VARCHAR(500), content TEXT, order_index INT NOT NULL DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE, INDEX idx_section_id (section_id));"

if %ERRORLEVEL% EQU 0 (
    echo ✅ Lessons table created!
) else (
    echo ❌ Failed to create lessons table.
    pause
    exit /b 1
)

docker exec -i elearning-mysql mysql -u root -prootpassword elearning_quiz -e "CREATE TABLE quizzes (id VARCHAR(36) PRIMARY KEY, section_id VARCHAR(36) NOT NULL, course_id VARCHAR(36) NOT NULL, tutor_id VARCHAR(36) NOT NULL, title VARCHAR(255) NOT NULL, description TEXT, passing_score INT NOT NULL DEFAULT 70, time_limit INT, is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, INDEX idx_section_id (section_id), INDEX idx_course_id (course_id), INDEX idx_tutor_id (tutor_id));"

if %ERRORLEVEL% EQU 0 (
    echo ✅ Quizzes table created!
) else (
    echo ❌ Failed to create quizzes table.
    pause
    exit /b 1
)

docker exec -i elearning-mysql mysql -u root -prootpassword elearning_quiz -e "CREATE TABLE quiz_questions (id VARCHAR(36) PRIMARY KEY, quiz_id VARCHAR(36) NOT NULL, question_text TEXT NOT NULL, correct_answer VARCHAR(10) NOT NULL, order_index INT NOT NULL DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE, INDEX idx_quiz_id (quiz_id));"

if %ERRORLEVEL% EQU 0 (
    echo ✅ Quiz questions table created!
) else (
    echo ❌ Failed to create quiz questions table.
    pause
    exit /b 1
)

docker exec -i elearning-mysql mysql -u root -prootpassword elearning_quiz -e "CREATE TABLE quiz_question_options (id VARCHAR(36) PRIMARY KEY, question_id VARCHAR(36) NOT NULL, option_text TEXT NOT NULL, is_correct BOOLEAN DEFAULT FALSE, order_index INT NOT NULL DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE, INDEX idx_question_id (question_id));"

if %ERRORLEVEL% EQU 0 (
    echo ✅ Quiz question options table created!
) else (
    echo ❌ Failed to create quiz question options table.
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

echo 🎉 Database reset completed successfully!
echo 📋 You can now test the API endpoints.
pause

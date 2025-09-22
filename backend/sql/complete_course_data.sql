-- Complete Course Data Update Script
-- This script will update all course data with complete information

-- Clear existing data
DELETE FROM quiz_question_options;
DELETE FROM quiz_questions;
DELETE FROM quizzes;
DELETE FROM lessons;
DELETE FROM sections;
DELETE FROM courses;

-- Insert Courses
INSERT INTO courses (id, title, slug, description, short_description, thumbnail, video_url, instructor_name, instructor_avatar, instructor_title, duration, level, rating, students_count, price, original_price, is_enrolled, last_accessed, completion_percentage, total_lessons, completed_lessons, created_at, updated_at) VALUES
('course-1', 'Goal Setting Masterclass: Achieve Your Dreams', 'goal-setting-masterclass-achieve-your-dreams', 'Learn the fundamentals of goal setting and achieve your dreams with this comprehensive masterclass. Master proven techniques used by successful people to set, track, and achieve their goals.', 'Master the art of goal setting and turn your dreams into reality', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=450&fit=crop', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'Steven Ford', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face', 'Productivity Expert & Life Coach', '2h 30m', 'Beginner', 4.8, 12500, 89, 149, true, '2024-01-15', 15, 8, 1, NOW(), NOW()),

('course-2', 'Focus and Concentration Boost: Achieve More', 'focus-and-concentration-boost-achieve-more', 'Master the art of focus and concentration to boost your productivity and achieve more in less time.', 'Boost your focus and concentration for maximum productivity', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 'Steven Ford', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face', 'Productivity Expert', '1h 45m', 'Intermediate', 4.7, 8900, 79, 129, true, '2024-01-10', 0, 6, 0, NOW(), NOW()),

('course-3', 'Time Management Mastery: Get More Done', 'time-management-mastery', 'Learn proven time management techniques to maximize your productivity and achieve your goals efficiently.', 'Master time management for maximum productivity', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'Sarah Johnson', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face', 'Time Management Specialist', '2h 15m', 'Beginner', 4.9, 15200, 95, 159, false, NULL, 0, 10, 0, NOW(), NOW()),

('course-4', 'React Development Mastery: From Zero to Hero', 'react-development-mastery-zero-to-hero', 'Master React development from the ground up. Learn modern React patterns, hooks, state management, and build real-world applications.', 'Complete React development course from beginner to advanced', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 'Anthony Shao', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face', 'Senior React Developer', '12h 30m', 'Intermediate', 4.8, 18500, 299, 399, true, '2024-01-20', 45, 25, 11, NOW(), NOW()),

('course-5', 'Design Thinking for Innovation', 'design-thinking-for-innovation', 'Learn the design thinking methodology to solve complex problems and create innovative solutions that users love.', 'Master design thinking methodology for innovation', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 'Sarah Johnson', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face', 'UX Design Lead', '3h 15m', 'Beginner', 4.7, 12300, 199, 299, false, NULL, 0, 12, 0, NOW(), NOW()),

('course-6', 'Business Strategy Fundamentals', 'business-strategy-fundamentals', 'Master the fundamentals of business strategy and learn how to develop, implement, and execute strategic plans for business success.', 'Learn business strategy fundamentals for success', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 'Michael Chen', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face', 'Business Strategy Consultant', '4h 20m', 'Intermediate', 4.6, 9800, 249, 349, false, NULL, 0, 18, 0, NOW(), NOW());

-- Insert Sections
INSERT INTO sections (id, course_id, title, is_expanded, completed, total, duration, is_unlocked, created_at, updated_at) VALUES
-- Course 1 (Goal Setting)
('section-1', 'course-1', 'Understanding Goals and Why They Matter', true, 1, 3, '13 mins 5 sec', true, NOW(), NOW()),
('goal-section-2', 'course-1', 'Setting and Achieving Your Goals', false, 0, 3, '18 mins 30 sec', false, NOW(), NOW()),
('goal-section-3', 'course-1', 'Advanced Goal Achievement Strategies', false, 0, 4, '18 mins 30 sec', false, NOW(), NOW()),

-- Course 2 (Focus)
('focus-section-1', 'course-2', 'Introduction to Focus and Concentration', true, 0, 6, '29 mins 45 sec', true, NOW(), NOW()),
('focus-section-2', 'course-2', 'Advanced Focus Techniques and Deep Work', false, 0, 5, '22 mins 30 sec', false, NOW(), NOW()),

-- Course 3 (Time Management)
('time-section-1', 'course-3', 'Fundamentals of Time Management', true, 0, 7, '32 mins 15 sec', true, NOW(), NOW()),
('time-section-2', 'course-3', 'Advanced Time Management Strategies', false, 0, 4, '18 mins 15 sec', false, NOW(), NOW()),

-- Course 4 (React)
('react-section-1', 'course-4', 'React Fundamentals', true, 5, 10, '82 mins', true, NOW(), NOW()),
('react-section-2', 'course-4', 'Advanced React Patterns and State Management', false, 0, 5, '45 mins', false, NOW(), NOW()),

-- Course 5 (Design Thinking)
('design-section-1', 'course-5', 'Introduction to Design Thinking', true, 0, 8, '44 mins', true, NOW(), NOW()),
('design-section-2', 'course-5', 'Advanced Design Thinking and Implementation', false, 0, 4, '20 mins', false, NOW(), NOW()),

-- Course 6 (Business Strategy)
('business-section-1', 'course-6', 'Strategic Planning Basics', true, 0, 10, '50 mins', true, NOW(), NOW()),
('business-section-2', 'course-6', 'Advanced Strategic Planning and Execution', false, 0, 4, '22 mins', false, NOW(), NOW());

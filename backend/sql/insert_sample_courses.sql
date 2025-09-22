-- Insert sample courses data into database
-- This script will populate the database with sample course data

-- Insert Courses
INSERT INTO courses (id, title, slug, description, short_description, thumbnail, video_url, instructor_name, instructor_avatar, instructor_title, duration, level, rating, students_count, price, original_price, is_enrolled, last_accessed, completion_percentage, total_lessons, completed_lessons, created_at, updated_at) VALUES
('course-1', 'Goal Setting Masterclass: Achieve Your Dreams', 'goal-setting-masterclass-achieve-your-dreams', 'Learn the fundamentals of goal setting and achieve your dreams with this comprehensive masterclass. Master proven techniques used by successful people to set, track, and achieve their goals.', 'Master the art of goal setting and turn your dreams into reality', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=450&fit=crop', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'Steven Ford', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face', 'Productivity Expert & Life Coach', '2h 30m', 'Beginner', 4.8, 12500, 89, 149, true, '2024-01-15', 15, 8, 1, NOW(), NOW()),

('course-2', 'Focus and Concentration Boost: Achieve More', 'focus-and-concentration-boost-achieve-more', 'Master the art of focus and concentration to boost your productivity and achieve more in less time.', 'Boost your focus and concentration for maximum productivity', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 'Steven Ford', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face', 'Productivity Expert', '1h 45m', 'Intermediate', 4.7, 8900, 79, 129, true, '2024-01-10', 0, 6, 0, NOW(), NOW()),

('course-3', 'Time Management Mastery: Get More Done', 'time-management-mastery', 'Learn proven time management techniques to maximize your productivity and achieve your goals efficiently.', 'Master time management for maximum productivity', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'Sarah Johnson', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face', 'Time Management Specialist', '2h 15m', 'Beginner', 4.9, 15200, 95, 159, false, NULL, 0, 10, 0, NOW(), NOW()),

('course-4', 'React Development Mastery: From Zero to Hero', 'react-development-mastery-zero-to-hero', 'Master React development from the ground up. Learn modern React patterns, hooks, state management, and build real-world applications.', 'Complete React development course from beginner to advanced', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 'Anthony Shao', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face', 'Senior React Developer', '12h 30m', 'Intermediate', 4.8, 18500, 299, 399, true, '2024-01-20', 45, 25, 11, NOW(), NOW()),

('course-5', 'Design Thinking for Innovation', 'design-thinking-for-innovation', 'Learn the design thinking methodology to solve complex problems and create innovative solutions that users love.', 'Master design thinking methodology for innovation', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 'Sarah Johnson', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face', 'UX Design Lead', '3h 15m', 'Beginner', 4.7, 12300, 199, 299, false, NULL, 0, 12, 0, NOW(), NOW()),

('course-6', 'Business Strategy Fundamentals', 'business-strategy-fundamentals', 'Master the fundamentals of business strategy and learn how to develop, implement, and execute strategic plans for business success.', 'Learn business strategy fundamentals for success', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 'Michael Chen', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face', 'Business Strategy Consultant', '4h 20m', 'Intermediate', 4.6, 9800, 249, 349, false, NULL, 0, 18, 0, NOW(), NOW());

-- Insert Sections for Course 1 (Goal Setting)
INSERT INTO sections (id, course_id, title, is_expanded, completed, total, duration, is_unlocked, created_at, updated_at) VALUES
('section-1', 'course-1', 'Understanding Goals and Why They Matter', true, 1, 3, '13 mins 5 sec', true, NOW(), NOW()),
('goal-section-2', 'course-1', 'Setting and Achieving Your Goals', false, 0, 3, '18 mins 30 sec', false, NOW(), NOW()),
('goal-section-3', 'course-1', 'Advanced Goal Achievement Strategies', false, 0, 4, '18 mins 30 sec', false, NOW(), NOW());

-- Insert Sections for Course 2 (Focus)
INSERT INTO sections (id, course_id, title, is_expanded, completed, total, duration, is_unlocked, created_at, updated_at) VALUES
('focus-section-1', 'course-2', 'Introduction to Focus and Concentration', true, 0, 6, '29 mins 45 sec', true, NOW(), NOW()),
('focus-section-2', 'course-2', 'Advanced Focus Techniques and Deep Work', false, 0, 5, '22 mins 30 sec', false, NOW(), NOW());

-- Insert Sections for Course 3 (Time Management)
INSERT INTO sections (id, course_id, title, is_expanded, completed, total, duration, is_unlocked, created_at, updated_at) VALUES
('time-section-1', 'course-3', 'Fundamentals of Time Management', true, 0, 7, '32 mins 15 sec', true, NOW(), NOW()),
('time-section-2', 'course-3', 'Advanced Time Management Strategies', false, 0, 4, '18 mins 15 sec', false, NOW(), NOW());

-- Insert Sections for Course 4 (React)
INSERT INTO sections (id, course_id, title, is_expanded, completed, total, duration, is_unlocked, created_at, updated_at) VALUES
('react-section-1', 'course-4', 'React Fundamentals', true, 5, 10, '82 mins', true, NOW(), NOW()),
('react-section-2', 'course-4', 'Advanced React Patterns and State Management', false, 0, 5, '45 mins', false, NOW(), NOW());

-- Insert Sections for Course 5 (Design Thinking)
INSERT INTO sections (id, course_id, title, is_expanded, completed, total, duration, is_unlocked, created_at, updated_at) VALUES
('design-section-1', 'course-5', 'Introduction to Design Thinking', true, 0, 8, '44 mins', true, NOW(), NOW()),
('design-section-2', 'course-5', 'Advanced Design Thinking and Implementation', false, 0, 4, '20 mins', false, NOW(), NOW());

-- Insert Sections for Course 6 (Business Strategy)
INSERT INTO sections (id, course_id, title, is_expanded, completed, total, duration, is_unlocked, created_at, updated_at) VALUES
('business-section-1', 'course-6', 'Strategic Planning Basics', true, 0, 10, '50 mins', true, NOW(), NOW()),
('business-section-2', 'course-6', 'Advanced Strategic Planning and Execution', false, 0, 4, '22 mins', false, NOW(), NOW());

-- Insert Lessons for Course 1, Section 1
INSERT INTO lessons (id, section_id, course_id, title, description, duration, is_completed, is_current, is_locked, video_url, content, order_index, created_at, updated_at) VALUES
('lesson-1', 'section-1', 'course-1', 'The Importance of Goal Setting', 'Learn why goal setting is crucial for success and how it can transform your life.', '4 mins 30 sec', true, false, false, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '', 1, NOW(), NOW()),
('lesson-2', 'section-1', 'course-1', 'Types of Goals: Short-term vs Long-term', 'Understand the difference between short-term and long-term goals and how to balance them.', '4 mins 15 sec', false, true, false, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '', 2, NOW(), NOW()),
('lesson-3', 'section-1', 'course-1', 'Creating a Vision Board', 'Learn how to create an effective vision board to visualize your goals.', '4 mins 20 sec', false, false, false, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', '', 3, NOW(), NOW());

-- Insert Lessons for Course 1, Section 2
INSERT INTO lessons (id, section_id, course_id, title, description, duration, is_completed, is_current, is_locked, video_url, content, order_index, created_at, updated_at) VALUES
('lesson-4', 'goal-section-2', 'course-1', 'SMART Goals Framework', 'Learn the SMART framework for setting effective and achievable goals.', '6 mins 15 sec', false, false, true, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', '', 1, NOW(), NOW()),
('lesson-5', 'goal-section-2', 'course-1', 'Breaking Down Big Goals', 'Master the art of breaking down large goals into manageable steps.', '6 mins 30 sec', false, false, true, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', '', 2, NOW(), NOW()),
('lesson-6', 'goal-section-2', 'course-1', 'Tracking Your Progress', 'Learn effective methods to track and monitor your goal progress.', '5 mins 45 sec', false, false, true, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', '', 3, NOW(), NOW());

-- Insert Lessons for Course 1, Section 3
INSERT INTO lessons (id, section_id, course_id, title, description, duration, is_completed, is_current, is_locked, video_url, content, order_index, created_at, updated_at) VALUES
('lesson-7', 'goal-section-3', 'course-1', 'Maintaining Motivation for Long-term Goals', 'Learn strategies to maintain motivation throughout your goal achievement journey.', '4 mins 30 sec', false, false, true, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', '', 1, NOW(), NOW()),
('lesson-8', 'goal-section-3', 'course-1', 'Building an Accountability System', 'Create a support system to help you stay accountable to your goals.', '4 mins 45 sec', false, false, true, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', '', 2, NOW(), NOW()),
('lesson-9', 'goal-section-3', 'course-1', 'Overcoming Obstacles and Setbacks', 'Develop resilience and strategies to overcome challenges in goal achievement.', '4 mins 30 sec', false, false, true, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', '', 3, NOW(), NOW()),
('lesson-10', 'goal-section-3', 'course-1', 'Reviewing and Adjusting Your Goals', 'Learn when and how to review and adjust your goals for better outcomes.', '4 mins 45 sec', false, false, true, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', '', 4, NOW(), NOW());

-- Insert Quizzes for Course 1, Section 1
INSERT INTO quizzes (id, section_id, course_id, tutor_id, title, description, passing_score, time_limit, is_active, created_at, updated_at) VALUES
('section-1-quiz', 'section-1', 'course-1', 'tutor-1', 'Goals and Vision Quiz', 'Test your understanding of goal setting fundamentals and vision creation', 70, 10, true, NOW(), NOW());

-- Insert Quiz Questions for Course 1, Section 1
INSERT INTO quiz_questions (id, quiz_id, question_text, correct_answer, order_index, created_at, updated_at) VALUES
('q1-section-1-quiz', 'section-1-quiz', 'What is the most important characteristic of effective goals?', 'b', 1, NOW(), NOW()),
('q2-section-1-quiz', 'section-1-quiz', 'What is the primary purpose of a vision board?', 'b', 2, NOW(), NOW()),
('q3-section-1-quiz', 'section-1-quiz', 'How long do short-term goals typically span?', 'c', 3, NOW(), NOW());

-- Insert Quiz Question Options for Course 1, Section 1
INSERT INTO quiz_question_options (id, question_id, option_text, is_correct, order_index, created_at, updated_at) VALUES
-- Question 1 options
('q1-a', 'q1-section-1-quiz', 'They should be easy to achieve', false, 1, NOW(), NOW()),
('q1-b', 'q1-section-1-quiz', 'They should be specific and measurable', true, 2, NOW(), NOW()),
('q1-c', 'q1-section-1-quiz', 'They should be vague and flexible', false, 3, NOW(), NOW()),
('q1-d', 'q1-section-1-quiz', 'They should be set by others', false, 4, NOW(), NOW()),

-- Question 2 options
('q2-a', 'q2-section-1-quiz', 'To decorate your workspace', false, 1, NOW(), NOW()),
('q2-b', 'q2-section-1-quiz', 'To visualize and reinforce your goals', true, 2, NOW(), NOW()),
('q2-c', 'q2-section-1-quiz', 'To track your daily tasks', false, 3, NOW(), NOW()),
('q2-d', 'q2-section-1-quiz', 'To organize your schedule', false, 4, NOW(), NOW()),

-- Question 3 options
('q3-a', 'q3-section-1-quiz', '1-3 days', false, 1, NOW(), NOW()),
('q3-b', 'q3-section-1-quiz', '1-3 weeks', false, 2, NOW(), NOW()),
('q3-c', 'q3-section-1-quiz', '1-3 months', true, 3, NOW(), NOW()),
('q3-d', 'q3-section-1-quiz', '1-3 years', false, 4, NOW(), NOW());

-- Insert Quizzes for Course 1, Section 2
INSERT INTO quizzes (id, section_id, course_id, tutor_id, title, description, passing_score, time_limit, is_active, created_at, updated_at) VALUES
('section-2-quiz', 'goal-section-2', 'course-1', 'tutor-1', 'SMART Goals and Achievement Quiz', 'Test your knowledge of SMART goals framework and goal achievement strategies', 70, 10, true, NOW(), NOW());

-- Insert Quiz Questions for Course 1, Section 2
INSERT INTO quiz_questions (id, quiz_id, question_text, correct_answer, order_index, created_at, updated_at) VALUES
('q1-section-2-quiz', 'section-2-quiz', 'What does the "S" in SMART goals stand for?', 'b', 1, NOW(), NOW()),
('q2-section-2-quiz', 'section-2-quiz', 'What is the benefit of breaking down big goals into smaller steps?', 'b', 2, NOW(), NOW()),
('q3-section-2-quiz', 'section-2-quiz', 'What is the most effective way to track goal progress?', 'b', 3, NOW(), NOW());

-- Insert Quiz Question Options for Course 1, Section 2
INSERT INTO quiz_question_options (id, question_id, option_text, is_correct, order_index, created_at, updated_at) VALUES
-- Question 1 options
('q1-a-2', 'q1-section-2-quiz', 'Simple', false, 1, NOW(), NOW()),
('q1-b-2', 'q1-section-2-quiz', 'Specific', true, 2, NOW(), NOW()),
('q1-c-2', 'q1-section-2-quiz', 'Short', false, 3, NOW(), NOW()),
('q1-d-2', 'q1-section-2-quiz', 'Strong', false, 4, NOW(), NOW()),

-- Question 2 options
('q2-a-2', 'q2-section-2-quiz', 'It makes them more complex', false, 1, NOW(), NOW()),
('q2-b-2', 'q2-section-2-quiz', 'It makes them more achievable', true, 2, NOW(), NOW()),
('q2-c-2', 'q2-section-2-quiz', 'It makes them take longer', false, 3, NOW(), NOW()),
('q2-d-2', 'q2-section-2-quiz', 'It makes them less important', false, 4, NOW(), NOW()),

-- Question 3 options
('q3-a-2', 'q3-section-2-quiz', 'Set it and forget it', false, 1, NOW(), NOW()),
('q3-b-2', 'q3-section-2-quiz', 'Regular review and adjustment', true, 2, NOW(), NOW()),
('q3-c-2', 'q3-section-2-quiz', 'Only check at the end', false, 3, NOW(), NOW()),
('q3-d-2', 'q3-section-2-quiz', 'Ask others to track for you', false, 4, NOW(), NOW());

-- Insert Quizzes for Course 1, Section 3
INSERT INTO quizzes (id, section_id, course_id, tutor_id, title, description, passing_score, time_limit, is_active, created_at, updated_at) VALUES
('section-3-quiz', 'goal-section-3', 'course-1', 'tutor-1', 'Advanced Goal Achievement Quiz', 'Test your knowledge of advanced goal setting and achievement strategies', 70, 10, true, NOW(), NOW());

-- Insert Quiz Questions for Course 1, Section 3
INSERT INTO quiz_questions (id, quiz_id, question_text, correct_answer, order_index, created_at, updated_at) VALUES
('q1-section-3-quiz', 'section-3-quiz', 'What is the most effective way to maintain motivation for long-term goals?', 'b', 1, NOW(), NOW()),
('q2-section-3-quiz', 'section-3-quiz', 'What is the benefit of having an accountability partner?', 'b', 2, NOW(), NOW()),
('q3-section-3-quiz', 'section-3-quiz', 'What should you do when you face obstacles in achieving your goals?', 'c', 3, NOW(), NOW());

-- Insert Quiz Question Options for Course 1, Section 3
INSERT INTO quiz_question_options (id, question_id, option_text, is_correct, order_index, created_at, updated_at) VALUES
-- Question 1 options
('q1-a-3', 'q1-section-3-quiz', 'Set only short-term goals', false, 1, NOW(), NOW()),
('q1-b-3', 'q1-section-3-quiz', 'Celebrate small wins along the way', true, 2, NOW(), NOW()),
('q1-c-3', 'q1-section-3-quiz', 'Work on goals alone without support', false, 3, NOW(), NOW()),
('q1-d-3', 'q1-section-3-quiz', 'Avoid reviewing progress regularly', false, 4, NOW(), NOW()),

-- Question 2 options
('q2-a-3', 'q2-section-3-quiz', 'They can do the work for you', false, 1, NOW(), NOW()),
('q2-b-3', 'q2-section-3-quiz', 'They provide support and keep you accountable', true, 2, NOW(), NOW()),
('q2-c-3', 'q2-section-3-quiz', 'They reduce the difficulty of goals', false, 3, NOW(), NOW()),
('q2-d-3', 'q2-section-3-quiz', 'They eliminate the need for planning', false, 4, NOW(), NOW()),

-- Question 3 options
('q3-a-3', 'q3-section-3-quiz', 'Give up immediately', false, 1, NOW(), NOW()),
('q3-b-3', 'q3-section-3-quiz', 'Lower your expectations', false, 2, NOW(), NOW()),
('q3-c-3', 'q3-section-3-quiz', 'Analyze the obstacle and adjust your approach', true, 3, NOW(), NOW()),
('q3-d-3', 'q3-section-3-quiz', 'Ignore the obstacle and continue as planned', false, 4, NOW(), NOW());

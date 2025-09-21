-- Sample Quiz Data
INSERT INTO quizzes (id, section_id, course_id, tutor_id, title, description, passing_score, time_limit, is_active, created_at, updated_at) VALUES
('quiz-1', 'section-1', 'course-1', 'tutor-1', 'Goal Setting Fundamentals Quiz', 'Test your understanding of goal setting principles and techniques', 70, 10, true, NOW(), NOW()),
('quiz-2', 'section-1', 'course-2', 'tutor-1', 'Focus and Concentration Quiz', 'Test your knowledge of focus techniques and concentration methods', 75, 15, true, NOW(), NOW()),
('quiz-3', 'section-1', 'course-3', 'tutor-1', 'Time Management Basics Quiz', 'Test your understanding of time management concepts and tools', 80, 12, false, NOW(), NOW()),
('quiz-4', 'section-1', 'course-4', 'tutor-1', 'React Fundamentals Quiz', 'Test your knowledge of React basics and component lifecycle', 70, 20, true, NOW(), NOW()),
('quiz-5', 'section-1', 'course-5', 'tutor-1', 'Design Thinking Process Quiz', 'Test your understanding of design thinking methodology', 75, 15, false, NOW(), NOW());

-- Sample Quiz Questions
INSERT INTO quiz_questions (id, quiz_id, question_text, correct_answer, question_order, created_at, updated_at) VALUES
('q1-1', 'quiz-1', 'What is the first step in effective goal setting?', 'a', 1, NOW(), NOW()),
('q1-2', 'quiz-1', 'Which of the following is NOT a characteristic of SMART goals?', 'c', 2, NOW(), NOW()),
('q1-3', 'quiz-1', 'How often should you review your goals?', 'b', 3, NOW(), NOW()),
('q1-4', 'quiz-1', 'What does the "R" in SMART goals stand for?', 'd', 4, NOW(), NOW()),
('q1-5', 'quiz-1', 'Which tool is most effective for tracking goal progress?', 'a', 5, NOW(), NOW());

-- Sample Quiz Question Options
INSERT INTO quiz_question_options (id, question_id, option_text, is_correct, option_order, created_at, updated_at) VALUES
-- Question 1 options
('opt-q1-1-a', 'q1-1', 'Write down your goals clearly', true, 1, NOW(), NOW()),
('opt-q1-1-b', 'q1-1', 'Tell your friends about them', false, 2, NOW(), NOW()),
('opt-q1-1-c', 'q1-1', 'Start working immediately', false, 3, NOW(), NOW()),
('opt-q1-1-d', 'q1-1', 'Make a detailed plan first', false, 4, NOW(), NOW()),

-- Question 2 options
('opt-q1-2-a', 'q1-2', 'Specific', false, 1, NOW(), NOW()),
('opt-q1-2-b', 'q1-2', 'Measurable', false, 2, NOW(), NOW()),
('opt-q1-2-c', 'q1-2', 'Subjective', true, 3, NOW(), NOW()),
('opt-q1-2-d', 'q1-2', 'Time-bound', false, 4, NOW(), NOW()),

-- Question 3 options
('opt-q1-3-a', 'q1-3', 'Once a year', false, 1, NOW(), NOW()),
('opt-q1-3-b', 'q1-3', 'Weekly or monthly', true, 2, NOW(), NOW()),
('opt-q1-3-c', 'q1-3', 'Only when you remember', false, 3, NOW(), NOW()),
('opt-q1-3-d', 'q1-3', 'Never, set and forget', false, 4, NOW(), NOW()),

-- Question 4 options
('opt-q1-4-a', 'q1-4', 'Realistic', false, 1, NOW(), NOW()),
('opt-q1-4-b', 'q1-4', 'Relevant', false, 2, NOW(), NOW()),
('opt-q1-4-c', 'q1-4', 'Recorded', false, 3, NOW(), NOW()),
('opt-q1-4-d', 'q1-4', 'Relevant', true, 4, NOW(), NOW()),

-- Question 5 options
('opt-q1-5-a', 'q1-5', 'Progress tracking journal', true, 1, NOW(), NOW()),
('opt-q1-5-b', 'q1-5', 'Mental notes only', false, 2, NOW(), NOW()),
('opt-q1-5-c', 'q1-5', 'Social media posts', false, 3, NOW(), NOW()),
('opt-q1-5-d', 'q1-5', 'Random reminders', false, 4, NOW(), NOW());

-- Add questions for the test quiz we created
INSERT INTO quiz_questions (id, quiz_id, question_text, correct_answer, question_order, created_at, updated_at) VALUES
('q-test-1', 'bbf22640-bfd7-4ce6-b432-ca342128ecca', 'What is the first step in effective goal setting?', 'a', 1, NOW(), NOW()),
('q-test-2', 'bbf22640-bfd7-4ce6-b432-ca342128ecca', 'Which of the following is NOT a characteristic of SMART goals?', 'c', 2, NOW(), NOW());

-- Add options for test quiz questions
INSERT INTO quiz_question_options (id, question_id, option_text, is_correct, option_order, created_at, updated_at) VALUES
-- Test Question 1 options
('opt-test-1-a', 'q-test-1', 'Write down your goals clearly', true, 1, NOW(), NOW()),
('opt-test-1-b', 'q-test-1', 'Tell your friends about them', false, 2, NOW(), NOW()),
('opt-test-1-c', 'q-test-1', 'Start working immediately', false, 3, NOW(), NOW()),
('opt-test-1-d', 'q-test-1', 'Make a detailed plan first', false, 4, NOW(), NOW()),

-- Test Question 2 options
('opt-test-2-a', 'q-test-2', 'Specific', false, 1, NOW(), NOW()),
('opt-test-2-b', 'q-test-2', 'Measurable', false, 2, NOW(), NOW()),
('opt-test-2-c', 'q-test-2', 'Subjective', true, 3, NOW(), NOW()),
('opt-test-2-d', 'q-test-2', 'Time-bound', false, 4, NOW(), NOW());

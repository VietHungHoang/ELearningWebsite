-- Complete Quiz Data
-- Insert all quizzes, questions, and options for all courses

-- Course 1 Quizzes
INSERT INTO quizzes (id, section_id, course_id, tutor_id, title, description, passing_score, time_limit, is_active, created_at, updated_at) VALUES
('section-1-quiz', 'section-1', 'course-1', 'tutor-1', 'Goals and Vision Quiz', 'Test your understanding of goal setting fundamentals and vision creation', 70, 10, true, NOW(), NOW()),
('section-2-quiz', 'goal-section-2', 'course-1', 'tutor-1', 'SMART Goals and Achievement Quiz', 'Test your knowledge of SMART goals framework and goal achievement strategies', 70, 10, true, NOW(), NOW()),
('section-3-quiz', 'goal-section-3', 'course-1', 'tutor-1', 'Advanced Goal Achievement Quiz', 'Test your knowledge of advanced goal setting and achievement strategies', 70, 10, true, NOW(), NOW());

-- Course 2 Quizzes
INSERT INTO quizzes (id, section_id, course_id, tutor_id, title, description, passing_score, time_limit, is_active, created_at, updated_at) VALUES
('focus-section-1-quiz', 'focus-section-1', 'course-2', 'tutor-1', 'Focus and Concentration Fundamentals Quiz', 'Test your understanding of focus, concentration, and productivity techniques', 70, 10, true, NOW(), NOW()),
('focus-section-2-quiz', 'focus-section-2', 'course-2', 'tutor-1', 'Advanced Focus Techniques Quiz', 'Test your understanding of advanced focus techniques and deep work strategies', 70, 10, true, NOW(), NOW());

-- Course 3 Quizzes
INSERT INTO quizzes (id, section_id, course_id, tutor_id, title, description, passing_score, time_limit, is_active, created_at, updated_at) VALUES
('time-section-1-quiz', 'time-section-1', 'course-3', 'tutor-1', 'Time Management Fundamentals Quiz', 'Test your understanding of time management principles and techniques', 70, 10, true, NOW(), NOW()),
('time-section-2-quiz', 'time-section-2', 'course-3', 'tutor-1', 'Advanced Time Management Quiz', 'Test your knowledge of advanced time management strategies and productivity systems', 70, 10, true, NOW(), NOW());

-- Course 4 Quizzes
INSERT INTO quizzes (id, section_id, course_id, tutor_id, title, description, passing_score, time_limit, is_active, created_at, updated_at) VALUES
('react-section-1-quiz', 'react-section-1', 'course-4', 'tutor-1', 'React Fundamentals Quiz', 'Test your understanding of React basics, components, and hooks', 70, 15, true, NOW(), NOW()),
('react-section-2-quiz', 'react-section-2', 'course-4', 'tutor-1', 'Advanced React Patterns Quiz', 'Test your understanding of advanced React patterns and state management', 70, 10, true, NOW(), NOW());

-- Course 5 Quizzes
INSERT INTO quizzes (id, section_id, course_id, tutor_id, title, description, passing_score, time_limit, is_active, created_at, updated_at) VALUES
('design-section-1-quiz', 'design-section-1', 'course-5', 'tutor-1', 'Design Thinking Fundamentals Quiz', 'Test your understanding of design thinking methodology and principles', 70, 10, true, NOW(), NOW()),
('design-section-2-quiz', 'design-section-2', 'course-5', 'tutor-1', 'Advanced Design Thinking Quiz', 'Test your knowledge of advanced design thinking concepts and implementation', 70, 10, true, NOW(), NOW());

-- Course 6 Quizzes
INSERT INTO quizzes (id, section_id, course_id, tutor_id, title, description, passing_score, time_limit, is_active, created_at, updated_at) VALUES
('business-section-1-quiz', 'business-section-1', 'course-6', 'tutor-1', 'Business Strategy Fundamentals Quiz', 'Test your understanding of business strategy concepts and planning', 70, 10, true, NOW(), NOW()),
('business-section-2-quiz', 'business-section-2', 'course-6', 'tutor-1', 'Advanced Business Strategy Quiz', 'Test your knowledge of advanced strategic planning and execution', 70, 10, true, NOW(), NOW());

-- Quiz Questions for Course 1, Section 1
INSERT INTO quiz_questions (id, quiz_id, question_text, correct_answer, order_index, created_at, updated_at) VALUES
('q1-section-1-quiz', 'section-1-quiz', 'What is the most important characteristic of effective goals?', 'b', 1, NOW(), NOW()),
('q2-section-1-quiz', 'section-1-quiz', 'What is the primary purpose of a vision board?', 'b', 2, NOW(), NOW()),
('q3-section-1-quiz', 'section-1-quiz', 'How long do short-term goals typically span?', 'c', 3, NOW(), NOW());

-- Quiz Questions for Course 1, Section 2
INSERT INTO quiz_questions (id, quiz_id, question_text, correct_answer, order_index, created_at, updated_at) VALUES
('q1-section-2-quiz', 'section-2-quiz', 'What does the "S" in SMART goals stand for?', 'b', 1, NOW(), NOW()),
('q2-section-2-quiz', 'section-2-quiz', 'What is the benefit of breaking down big goals into smaller steps?', 'b', 2, NOW(), NOW()),
('q3-section-2-quiz', 'section-2-quiz', 'What is the most effective way to track goal progress?', 'b', 3, NOW(), NOW());

-- Quiz Questions for Course 1, Section 3
INSERT INTO quiz_questions (id, quiz_id, question_text, correct_answer, order_index, created_at, updated_at) VALUES
('q1-section-3-quiz', 'section-3-quiz', 'What is the most effective way to maintain motivation for long-term goals?', 'b', 1, NOW(), NOW()),
('q2-section-3-quiz', 'section-3-quiz', 'What is the benefit of having an accountability partner?', 'b', 2, NOW(), NOW()),
('q3-section-3-quiz', 'section-3-quiz', 'What should you do when you face obstacles in achieving your goals?', 'c', 3, NOW(), NOW());

-- Quiz Questions for Course 2, Section 1
INSERT INTO quiz_questions (id, quiz_id, question_text, correct_answer, order_index, created_at, updated_at) VALUES
('q1-focus-section-1-quiz', 'focus-section-1-quiz', 'What is the primary benefit of maintaining focus?', 'b', 1, NOW(), NOW()),
('q2-focus-section-1-quiz', 'focus-section-1-quiz', 'How long is a typical Pomodoro work session?', 'b', 2, NOW(), NOW()),
('q3-focus-section-1-quiz', 'focus-section-1-quiz', 'What is the most common source of distraction in modern work?', 'b', 3, NOW(), NOW());

-- Quiz Questions for Course 2, Section 2
INSERT INTO quiz_questions (id, quiz_id, question_text, correct_answer, order_index, created_at, updated_at) VALUES
('q1-focus-section-2-quiz', 'focus-section-2-quiz', 'What is the concept of "deep work" as described by Cal Newport?', 'b', 1, NOW(), NOW()),
('q2-focus-section-2-quiz', 'focus-section-2-quiz', 'What is the recommended duration for a deep work session?', 'c', 2, NOW(), NOW()),
('q3-focus-section-2-quiz', 'focus-section-2-quiz', 'What is the "flow state" and how can it be achieved?', 'b', 3, NOW(), NOW());

-- Quiz Questions for Course 3, Section 1
INSERT INTO quiz_questions (id, quiz_id, question_text, correct_answer, order_index, created_at, updated_at) VALUES
('q1-time-section-1-quiz', 'time-section-1-quiz', 'What is the main difference between time and energy management?', 'a', 1, NOW(), NOW()),
('q2-time-section-1-quiz', 'time-section-1-quiz', 'In the Eisenhower Matrix, which quadrant contains urgent and important tasks?', 'a', 2, NOW(), NOW()),
('q3-time-section-1-quiz', 'time-section-1-quiz', 'What is the main benefit of time blocking?', 'b', 3, NOW(), NOW());

-- Quiz Questions for Course 3, Section 2
INSERT INTO quiz_questions (id, quiz_id, question_text, correct_answer, order_index, created_at, updated_at) VALUES
('q1-time-section-2-quiz', 'time-section-2-quiz', 'What is the "Two-Minute Rule" in productivity?', 'b', 1, NOW(), NOW()),
('q2-time-section-2-quiz', 'time-section-2-quiz', 'What is the purpose of a "weekly review" in time management?', 'b', 2, NOW(), NOW()),
('q3-time-section-2-quiz', 'time-section-2-quiz', 'What is "batching" in time management?', 'b', 3, NOW(), NOW());

-- Quiz Questions for Course 4, Section 1
INSERT INTO quiz_questions (id, quiz_id, question_text, correct_answer, order_index, created_at, updated_at) VALUES
('q1-react-section-1-quiz', 'react-section-1-quiz', 'Why do we need keys when rendering lists in React?', 'b', 1, NOW(), NOW()),
('q2-react-section-1-quiz', 'react-section-1-quiz', 'When should array indices be used as keys for list items?', 'c', 2, NOW(), NOW()),
('q3-react-section-1-quiz', 'react-section-1-quiz', 'What is the primary purpose of the useState hook?', 'b', 3, NOW(), NOW());

-- Quiz Questions for Course 4, Section 2
INSERT INTO quiz_questions (id, quiz_id, question_text, correct_answer, order_index, created_at, updated_at) VALUES
('q1-react-section-2-quiz', 'react-section-2-quiz', 'What is the purpose of useReducer hook in React?', 'b', 1, NOW(), NOW()),
('q2-react-section-2-quiz', 'react-section-2-quiz', 'What is the main benefit of using React.memo()?', 'b', 2, NOW(), NOW()),
('q3-react-section-2-quiz', 'react-section-2-quiz', 'What is the purpose of useCallback hook?', 'b', 3, NOW(), NOW());

-- Quiz Questions for Course 5, Section 1
INSERT INTO quiz_questions (id, quiz_id, question_text, correct_answer, order_index, created_at, updated_at) VALUES
('q1-design-section-1-quiz', 'design-section-1-quiz', 'What is the primary goal of design thinking?', 'b', 1, NOW(), NOW()),
('q2-design-section-1-quiz', 'design-section-1-quiz', 'Who can benefit from design thinking?', 'c', 2, NOW(), NOW()),
('q3-design-section-1-quiz', 'design-section-1-quiz', 'How many stages are there in the design thinking process?', 'b', 3, NOW(), NOW());

-- Quiz Questions for Course 5, Section 2
INSERT INTO quiz_questions (id, quiz_id, question_text, correct_answer, order_index, created_at, updated_at) VALUES
('q1-design-section-2-quiz', 'design-section-2-quiz', 'What is the purpose of rapid prototyping in design thinking?', 'b', 1, NOW(), NOW()),
('q2-design-section-2-quiz', 'design-section-2-quiz', 'What is the main goal of the "Test" phase in design thinking?', 'b', 2, NOW(), NOW()),
('q3-design-section-2-quiz', 'design-section-2-quiz', 'What is the benefit of involving users throughout the design thinking process?', 'b', 3, NOW(), NOW());

-- Quiz Questions for Course 6, Section 1
INSERT INTO quiz_questions (id, quiz_id, question_text, correct_answer, order_index, created_at, updated_at) VALUES
('q1-business-section-1-quiz', 'business-section-1-quiz', 'What is the primary purpose of a business strategy?', 'b', 1, NOW(), NOW()),
('q2-business-section-1-quiz', 'business-section-1-quiz', 'What characteristic should a good business strategy have?', 'b', 2, NOW(), NOW()),
('q3-business-section-1-quiz', 'business-section-1-quiz', 'What does SWOT analysis stand for?', 'a', 3, NOW(), NOW());

-- Quiz Questions for Course 6, Section 2
INSERT INTO quiz_questions (id, quiz_id, question_text, correct_answer, order_index, created_at, updated_at) VALUES
('q1-business-section-2-quiz', 'business-section-2-quiz', 'What is the purpose of scenario planning in business strategy?', 'b', 1, NOW(), NOW()),
('q2-business-section-2-quiz', 'business-section-2-quiz', 'What is the key to successful strategy execution?', 'b', 2, NOW(), NOW()),
('q3-business-section-2-quiz', 'business-section-2-quiz', 'What is the balanced scorecard approach to strategy?', 'b', 3, NOW(), NOW());

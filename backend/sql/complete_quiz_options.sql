-- Complete Quiz Options Data
-- Insert all quiz question options for all courses

-- Course 1, Section 1 Quiz Options
INSERT INTO quiz_question_options (id, question_id, option_text, is_correct, order_index, created_at, updated_at) VALUES
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

-- Course 1, Section 2 Quiz Options
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

-- Course 1, Section 3 Quiz Options
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

-- Course 2, Section 1 Quiz Options
INSERT INTO quiz_question_options (id, question_id, option_text, is_correct, order_index, created_at, updated_at) VALUES
-- Question 1 options
('q1-a-focus-1', 'q1-focus-section-1-quiz', 'It reduces the need for breaks', false, 1, NOW(), NOW()),
('q1-b-focus-1', 'q1-focus-section-1-quiz', 'It increases productivity and quality of work', true, 2, NOW(), NOW()),
('q1-c-focus-1', 'q1-focus-section-1-quiz', 'It eliminates all distractions', false, 3, NOW(), NOW()),
('q1-d-focus-1', 'q1-focus-section-1-quiz', 'It makes tasks easier to complete', false, 4, NOW(), NOW()),

-- Question 2 options
('q2-a-focus-1', 'q2-focus-section-1-quiz', '15 minutes', false, 1, NOW(), NOW()),
('q2-b-focus-1', 'q2-focus-section-1-quiz', '25 minutes', true, 2, NOW(), NOW()),
('q2-c-focus-1', 'q2-focus-section-1-quiz', '45 minutes', false, 3, NOW(), NOW()),
('q2-d-focus-1', 'q2-focus-section-1-quiz', '60 minutes', false, 4, NOW(), NOW()),

-- Question 3 options
('q3-a-focus-1', 'q3-focus-section-1-quiz', 'Noise from colleagues', false, 1, NOW(), NOW()),
('q3-b-focus-1', 'q3-focus-section-1-quiz', 'Digital notifications', true, 2, NOW(), NOW()),
('q3-c-focus-1', 'q3-focus-section-1-quiz', 'Poor lighting', false, 3, NOW(), NOW()),
('q3-d-focus-1', 'q3-focus-section-1-quiz', 'Uncomfortable chairs', false, 4, NOW(), NOW());

-- Course 2, Section 2 Quiz Options
INSERT INTO quiz_question_options (id, question_id, option_text, is_correct, order_index, created_at, updated_at) VALUES
-- Question 1 options
('q1-a-focus-2', 'q1-focus-section-2-quiz', 'Working for long hours without breaks', false, 1, NOW(), NOW()),
('q1-b-focus-2', 'q1-focus-section-2-quiz', 'Professional activities performed in a state of distraction-free concentration', true, 2, NOW(), NOW()),
('q1-c-focus-2', 'q1-focus-section-2-quiz', 'Working on multiple tasks simultaneously', false, 3, NOW(), NOW()),
('q1-d-focus-2', 'q1-focus-section-2-quiz', 'Working only in the morning hours', false, 4, NOW(), NOW()),

-- Question 2 options
('q2-a-focus-2', 'q2-focus-section-2-quiz', '30 minutes', false, 1, NOW(), NOW()),
('q2-b-focus-2', 'q2-focus-section-2-quiz', '1-2 hours', false, 2, NOW(), NOW()),
('q2-c-focus-2', 'q2-focus-section-2-quiz', '90 minutes to 4 hours', true, 3, NOW(), NOW()),
('q2-d-focus-2', 'q2-focus-section-2-quiz', '6-8 hours', false, 4, NOW(), NOW()),

-- Question 3 options
('q3-a-focus-2', 'q3-focus-section-2-quiz', 'A state of complete relaxation', false, 1, NOW(), NOW()),
('q3-b-focus-2', 'q3-focus-section-2-quiz', 'A state of optimal performance where you lose track of time', true, 2, NOW(), NOW()),
('q3-c-focus-2', 'q3-focus-section-2-quiz', 'A state of high stress and pressure', false, 3, NOW(), NOW()),
('q3-d-focus-2', 'q3-focus-section-2-quiz', 'A state of multitasking efficiently', false, 4, NOW(), NOW());

-- Course 3, Section 1 Quiz Options
INSERT INTO quiz_question_options (id, question_id, option_text, is_correct, order_index, created_at, updated_at) VALUES
-- Question 1 options
('q1-a-time-1', 'q1-time-section-1-quiz', 'Time is finite, energy can be renewed', true, 1, NOW(), NOW()),
('q1-b-time-1', 'q1-time-section-1-quiz', 'Time is renewable, energy is finite', false, 2, NOW(), NOW()),
('q1-c-time-1', 'q1-time-section-1-quiz', 'There is no difference between them', false, 3, NOW(), NOW()),
('q1-d-time-1', 'q1-time-section-1-quiz', 'Time management is more important', false, 4, NOW(), NOW()),

-- Question 2 options
('q2-a-time-1', 'q2-time-section-1-quiz', 'Quadrant 1: Do First', true, 1, NOW(), NOW()),
('q2-b-time-1', 'q2-time-section-1-quiz', 'Quadrant 2: Schedule', false, 2, NOW(), NOW()),
('q2-c-time-1', 'q2-time-section-1-quiz', 'Quadrant 3: Delegate', false, 3, NOW(), NOW()),
('q2-d-time-1', 'q2-time-section-1-quiz', 'Quadrant 4: Eliminate', false, 4, NOW(), NOW()),

-- Question 3 options
('q3-a-time-1', 'q3-time-section-1-quiz', 'It increases the number of tasks you can do', false, 1, NOW(), NOW()),
('q3-b-time-1', 'q3-time-section-1-quiz', 'It reduces context switching between different tasks', true, 2, NOW(), NOW()),
('q3-c-time-1', 'q3-time-section-1-quiz', 'It makes tasks take longer to complete', false, 3, NOW(), NOW()),
('q3-d-time-1', 'q3-time-section-1-quiz', 'It eliminates the need for breaks', false, 4, NOW(), NOW());

-- Course 3, Section 2 Quiz Options
INSERT INTO quiz_question_options (id, question_id, option_text, is_correct, order_index, created_at, updated_at) VALUES
-- Question 1 options
('q1-a-time-2', 'q1-time-section-2-quiz', 'Spend only two minutes on each task', false, 1, NOW(), NOW()),
('q1-b-time-2', 'q1-time-section-2-quiz', 'If a task takes less than two minutes, do it immediately', true, 2, NOW(), NOW()),
('q1-c-time-2', 'q1-time-section-2-quiz', 'Take a two-minute break every hour', false, 3, NOW(), NOW()),
('q1-d-time-2', 'q1-time-section-2-quiz', 'Complete tasks in two-minute intervals', false, 4, NOW(), NOW()),

-- Question 2 options
('q2-a-time-2', 'q2-time-section-2-quiz', 'To plan all tasks for the week', false, 1, NOW(), NOW()),
('q2-b-time-2', 'q2-time-section-2-quiz', 'To reflect on the past week and plan the next', true, 2, NOW(), NOW()),
('q2-c-time-2', 'q2-time-section-2-quiz', 'To review only completed tasks', false, 3, NOW(), NOW()),
('q2-d-time-2', 'q2-time-section-2-quiz', 'To eliminate all uncompleted tasks', false, 4, NOW(), NOW()),

-- Question 3 options
('q3-a-time-2', 'q3-time-section-2-quiz', 'Working on multiple projects simultaneously', false, 1, NOW(), NOW()),
('q3-b-time-2', 'q3-time-section-2-quiz', 'Grouping similar tasks together to work on them consecutively', true, 2, NOW(), NOW()),
('q3-c-time-2', 'q3-time-section-2-quiz', 'Completing tasks in alphabetical order', false, 3, NOW(), NOW()),
('q3-d-time-2', 'q3-time-section-2-quiz', 'Working in teams of two people', false, 4, NOW(), NOW());

-- Complete Remaining Quiz Options Data
-- Insert quiz question options for React, Design Thinking, and Business Strategy courses

-- Course 4, Section 1 Quiz Options (React Fundamentals)
INSERT INTO quiz_question_options (id, question_id, option_text, is_correct, order_index, created_at, updated_at) VALUES
-- Question 1 options
('q1-a-react-1', 'q1-react-section-1-quiz', 'Keys make the code more readable', false, 1, NOW(), NOW()),
('q1-b-react-1', 'q1-react-section-1-quiz', 'Keys help React identify which items have changed', true, 2, NOW(), NOW()),
('q1-c-react-1', 'q1-react-section-1-quiz', 'Keys are required for all JSX elements', false, 3, NOW(), NOW()),
('q1-d-react-1', 'q1-react-section-1-quiz', 'Keys improve performance by caching components', false, 4, NOW(), NOW()),

-- Question 2 options
('q2-a-react-1', 'q2-react-section-1-quiz', 'Always, as they are the most efficient', false, 1, NOW(), NOW()),
('q2-b-react-1', 'q2-react-section-1-quiz', 'Never, as they can cause performance issues', false, 2, NOW(), NOW()),
('q2-c-react-1', 'q2-react-section-1-quiz', 'Only when the list order never changes', true, 3, NOW(), NOW()),
('q2-d-react-1', 'q2-react-section-1-quiz', 'Only for small lists with less than 10 items', false, 4, NOW(), NOW()),

-- Question 3 options
('q3-a-react-1', 'q3-react-section-1-quiz', 'To perform side effects', false, 1, NOW(), NOW()),
('q3-b-react-1', 'q3-react-section-1-quiz', 'To manage state in functional components', true, 2, NOW(), NOW()),
('q3-c-react-1', 'q3-react-section-1-quiz', 'To create class components', false, 3, NOW(), NOW()),
('q3-d-react-1', 'q3-react-section-1-quiz', 'To handle events', false, 4, NOW(), NOW());

-- Course 4, Section 2 Quiz Options (React Advanced)
INSERT INTO quiz_question_options (id, question_id, option_text, is_correct, order_index, created_at, updated_at) VALUES
-- Question 1 options
('q1-a-react-2', 'q1-react-section-2-quiz', 'To replace useState for all state management', false, 1, NOW(), NOW()),
('q1-b-react-2', 'q1-react-section-2-quiz', 'To manage complex state logic with a reducer function', true, 2, NOW(), NOW()),
('q1-c-react-2', 'q1-react-section-2-quiz', 'To create custom hooks', false, 3, NOW(), NOW()),
('q1-d-react-2', 'q1-react-section-2-quiz', 'To handle side effects', false, 4, NOW(), NOW()),

-- Question 2 options
('q2-a-react-2', 'q2-react-section-2-quiz', 'To create memoized components', false, 1, NOW(), NOW()),
('q2-b-react-2', 'q2-react-section-2-quiz', 'To prevent unnecessary re-renders by memoizing components', true, 2, NOW(), NOW()),
('q2-c-react-2', 'q2-react-section-2-quiz', 'To create higher-order components', false, 3, NOW(), NOW()),
('q2-d-react-2', 'q2-react-section-2-quiz', 'To manage component state', false, 4, NOW(), NOW()),

-- Question 3 options
('q3-a-react-2', 'q3-react-section-2-quiz', 'To create callback functions', false, 1, NOW(), NOW()),
('q3-b-react-2', 'q3-react-section-2-quiz', 'To memoize callback functions to prevent unnecessary re-renders', true, 2, NOW(), NOW()),
('q3-c-react-2', 'q3-react-section-2-quiz', 'To handle async operations', false, 3, NOW(), NOW()),
('q3-d-react-2', 'q3-react-section-2-quiz', 'To manage component lifecycle', false, 4, NOW(), NOW());

-- Course 5, Section 1 Quiz Options (Design Thinking)
INSERT INTO quiz_question_options (id, question_id, option_text, is_correct, order_index, created_at, updated_at) VALUES
-- Question 1 options
('q1-a-design-1', 'q1-design-section-1-quiz', 'To create beautiful designs', false, 1, NOW(), NOW()),
('q1-b-design-1', 'q1-design-section-1-quiz', 'To solve complex problems with user-centered solutions', true, 2, NOW(), NOW()),
('q1-c-design-1', 'q1-design-section-1-quiz', 'To reduce development costs', false, 3, NOW(), NOW()),
('q1-d-design-1', 'q1-design-section-1-quiz', 'To speed up the design process', false, 4, NOW(), NOW()),

-- Question 2 options
('q2-a-design-1', 'q2-design-section-1-quiz', 'Only professional designers', false, 1, NOW(), NOW()),
('q2-b-design-1', 'q2-design-section-1-quiz', 'Only people in creative fields', false, 2, NOW(), NOW()),
('q2-c-design-1', 'q2-design-section-1-quiz', 'Anyone in any field to solve problems creatively', true, 3, NOW(), NOW()),
('q2-d-design-1', 'q2-design-section-1-quiz', 'Only people working in tech companies', false, 4, NOW(), NOW()),

-- Question 3 options
('q3-a-design-1', 'q3-design-section-1-quiz', '3 stages', false, 1, NOW(), NOW()),
('q3-b-design-1', 'q3-design-section-1-quiz', '5 stages', true, 2, NOW(), NOW()),
('q3-c-design-1', 'q3-design-section-1-quiz', '7 stages', false, 3, NOW(), NOW()),
('q3-d-design-1', 'q3-design-section-1-quiz', '10 stages', false, 4, NOW(), NOW());

-- Course 5, Section 2 Quiz Options (Design Thinking Advanced)
INSERT INTO quiz_question_options (id, question_id, option_text, is_correct, order_index, created_at, updated_at) VALUES
-- Question 1 options
('q1-a-design-2', 'q1-design-section-2-quiz', 'To create perfect final products', false, 1, NOW(), NOW()),
('q1-b-design-2', 'q1-design-section-2-quiz', 'To quickly test and validate ideas with users', true, 2, NOW(), NOW()),
('q1-c-design-2', 'q1-design-section-2-quiz', 'To save money on development', false, 3, NOW(), NOW()),
('q1-d-design-2', 'q1-design-section-2-quiz', 'To impress stakeholders', false, 4, NOW(), NOW()),

-- Question 2 options
('q2-a-design-2', 'q2-design-section-2-quiz', 'To create the final product', false, 1, NOW(), NOW()),
('q2-b-design-2', 'q2-design-section-2-quiz', 'To gather feedback and iterate on solutions', true, 2, NOW(), NOW()),
('q2-c-design-2', 'q2-design-section-2-quiz', 'To present to stakeholders', false, 3, NOW(), NOW()),
('q2-d-design-2', 'q2-design-section-2-quiz', 'To document the process', false, 4, NOW(), NOW()),

-- Question 3 options
('q3-a-design-2', 'q3-design-section-2-quiz', 'To reduce development time', false, 1, NOW(), NOW()),
('q3-b-design-2', 'q3-design-section-2-quiz', 'To ensure solutions meet real user needs', true, 2, NOW(), NOW()),
('q3-c-design-2', 'q3-design-section-2-quiz', 'To avoid making decisions', false, 3, NOW(), NOW()),
('q3-d-design-2', 'q3-design-section-2-quiz', 'To increase project costs', false, 4, NOW(), NOW());

-- Course 6, Section 1 Quiz Options (Business Strategy)
INSERT INTO quiz_question_options (id, question_id, option_text, is_correct, order_index, created_at, updated_at) VALUES
-- Question 1 options
('q1-a-business-1', 'q1-business-section-1-quiz', 'To increase employee satisfaction', false, 1, NOW(), NOW()),
('q1-b-business-1', 'q1-business-section-1-quiz', 'To achieve competitive advantage and organizational goals', true, 2, NOW(), NOW()),
('q1-c-business-1', 'q1-business-section-1-quiz', 'To reduce operational costs', false, 3, NOW(), NOW()),
('q1-d-business-1', 'q1-business-section-1-quiz', 'To improve product quality', false, 4, NOW(), NOW()),

-- Question 2 options
('q2-a-business-1', 'q2-business-section-1-quiz', 'It should be rigid and unchanging', false, 1, NOW(), NOW()),
('q2-b-business-1', 'q2-business-section-1-quiz', 'It should be flexible and adaptable to changing market conditions', true, 2, NOW(), NOW()),
('q2-c-business-1', 'q2-business-section-1-quiz', 'It should focus only on short-term goals', false, 3, NOW(), NOW()),
('q2-d-business-1', 'q2-business-section-1-quiz', 'It should ignore market trends', false, 4, NOW(), NOW()),

-- Question 3 options
('q3-a-business-1', 'q3-business-section-1-quiz', 'Strengths, Weaknesses, Opportunities, Threats', true, 1, NOW(), NOW()),
('q3-b-business-1', 'q3-business-section-1-quiz', 'Strategy, Workflow, Operations, Technology', false, 2, NOW(), NOW()),
('q3-c-business-1', 'q3-business-section-1-quiz', 'Sales, Workforce, Objectives, Targets', false, 3, NOW(), NOW()),
('q3-d-business-1', 'q3-business-section-1-quiz', 'Success, Wisdom, Organization, Training', false, 4, NOW(), NOW());

-- Course 6, Section 2 Quiz Options (Business Strategy Advanced)
INSERT INTO quiz_question_options (id, question_id, option_text, is_correct, order_index, created_at, updated_at) VALUES
-- Question 1 options
('q1-a-business-2', 'q1-business-section-2-quiz', 'To predict the future accurately', false, 1, NOW(), NOW()),
('q1-b-business-2', 'q1-business-section-2-quiz', 'To prepare for multiple possible futures', true, 2, NOW(), NOW()),
('q1-c-business-2', 'q1-business-section-2-quiz', 'To eliminate all risks', false, 3, NOW(), NOW()),
('q1-d-business-2', 'q1-business-section-2-quiz', 'To reduce planning time', false, 4, NOW(), NOW()),

-- Question 2 options
('q2-a-business-2', 'q2-business-section-2-quiz', 'Having a perfect strategy', false, 1, NOW(), NOW()),
('q2-b-business-2', 'q2-business-section-2-quiz', 'Aligning people, processes, and systems with strategy', true, 2, NOW(), NOW()),
('q2-c-business-2', 'q2-business-section-2-quiz', 'Having unlimited resources', false, 3, NOW(), NOW()),
('q2-d-business-2', 'q2-business-section-2-quiz', 'Avoiding all changes', false, 4, NOW(), NOW()),

-- Question 3 options
('q3-a-business-2', 'q3-business-section-2-quiz', 'Focusing only on financial metrics', false, 1, NOW(), NOW()),
('q3-b-business-2', 'q3-business-section-2-quiz', 'Balancing financial, customer, internal process, and learning perspectives', true, 2, NOW(), NOW()),
('q3-c-business-2', 'q3-business-section-2-quiz', 'Measuring only customer satisfaction', false, 3, NOW(), NOW()),
('q3-d-business-2', 'q3-business-section-2-quiz', 'Avoiding all measurements', false, 4, NOW(), NOW());

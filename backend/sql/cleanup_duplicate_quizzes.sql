-- Clean up duplicate quiz data
-- This script removes duplicate quizzes for the same section, keeping only the first one

-- First, let's see what duplicates we have
SELECT section_id, COUNT(*) as quiz_count
FROM quizzes 
GROUP BY section_id 
HAVING COUNT(*) > 1
ORDER BY quiz_count DESC;

-- Create a temporary table to identify which quizzes to keep
CREATE TEMPORARY TABLE quiz_to_keep AS
SELECT 
    q1.id,
    q1.section_id,
    ROW_NUMBER() OVER (PARTITION BY q1.section_id ORDER BY q1.created_at ASC) as rn
FROM quizzes q1
WHERE q1.section_id IN (
    SELECT section_id 
    FROM quizzes 
    GROUP BY section_id 
    HAVING COUNT(*) > 1
);

-- Show which quizzes will be kept
SELECT 
    qtk.id as quiz_id_to_keep,
    qtk.section_id,
    q.title,
    q.created_at
FROM quiz_to_keep qtk
JOIN quizzes q ON qtk.id = q.id
WHERE qtk.rn = 1
ORDER BY qtk.section_id;

-- Delete duplicate quizzes (keep only the first one for each section)
DELETE q FROM quizzes q
JOIN quiz_to_keep qtk ON q.section_id = qtk.section_id
WHERE q.id != qtk.id AND qtk.rn = 1;

-- Verify the cleanup
SELECT section_id, COUNT(*) as quiz_count
FROM quizzes 
GROUP BY section_id 
HAVING COUNT(*) > 1;

-- Drop temporary table
DROP TEMPORARY TABLE quiz_to_keep;

-- Show final quiz count per section
SELECT section_id, COUNT(*) as quiz_count
FROM quizzes 
GROUP BY section_id 
ORDER BY section_id;

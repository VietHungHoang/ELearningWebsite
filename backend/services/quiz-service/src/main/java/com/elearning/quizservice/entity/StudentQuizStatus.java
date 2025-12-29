package com.elearning.quizservice.entity;

/**
 * Enum representing the status of a quiz from a student's perspective.
 * This is computed based on the student's attempt history for a quiz.
 */
public enum StudentQuizStatus {
    /**
     * Quiz is published but student has not started any attempt
     */
    NOT_STARTED,
    
    /**
     * Student has an attempt with IN_PROGRESS status
     */
    IN_PROGRESS,
    
    /**
     * Student has completed at least one attempt (SUBMITTED or GRADED)
     */
    COMPLETED
}

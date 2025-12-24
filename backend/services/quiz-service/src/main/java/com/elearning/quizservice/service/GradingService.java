package com.elearning.quizservice.service;

import com.elearning.quizservice.dto.response.QuizResultResponse;
import com.elearning.quizservice.dto.response.QuizStatisticsResponse;
import com.elearning.quizservice.entity.QuizAttempt;

import java.util.List;
import java.util.UUID;

/**
 * Service interface for grading quizzes
 */
public interface GradingService {
    
    /**
     * Grade a quiz attempt
     */
    QuizAttempt gradeAttempt(UUID attemptId);
    
    /**
     * Calculate score for an attempt
     */
    void calculateScore(QuizAttempt attempt);
    
    /**
     * Check if answer is correct
     */
    boolean isAnswerCorrect(UUID questionId, List<UUID> selectedOptionIds);
    
    /**
     * Calculate points earned for a question
     */
    Integer calculatePointsEarned(UUID questionId, List<UUID> selectedOptionIds);
    
    /**
     * Build quiz result response
     */
    QuizResultResponse buildQuizResult(UUID attemptId);
    
    /**
     * Get quiz statistics
     */
    QuizStatisticsResponse getQuizStatistics(UUID quizId);
}

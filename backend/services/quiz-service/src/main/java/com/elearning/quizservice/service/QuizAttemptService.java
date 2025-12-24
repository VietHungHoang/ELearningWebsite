package com.elearning.quizservice.service;

import com.elearning.quizservice.dto.request.SubmitAnswerRequest;
import com.elearning.quizservice.dto.request.SubmitQuizRequest;
import com.elearning.quizservice.dto.response.QuizAttemptResponse;
import com.elearning.quizservice.dto.response.QuizResultResponse;
import com.elearning.quizservice.entity.QuizAttempt;

import java.util.List;
import java.util.UUID;

/**
 * Service interface for QuizAttempt operations
 */
public interface QuizAttemptService {
    
    /**
     * Start a new quiz attempt
     */
    QuizAttemptResponse startQuizAttempt(UUID quizId, UUID studentId);
    
    /**
     * Get attempt by ID
     */
    QuizAttempt getAttemptById(UUID attemptId);
    
    /**
     * Get current in-progress attempt for a student
     */
    QuizAttemptResponse getCurrentAttempt(UUID quizId, UUID studentId);
    
    /**
     * Save answer for a question
     */
    void saveAnswer(UUID attemptId, SubmitAnswerRequest request);
    
    /**
     * Submit quiz attempt for grading
     */
    QuizResultResponse submitQuizAttempt(UUID attemptId, UUID studentId, SubmitQuizRequest request);
    
    /**
     * Get quiz result
     */
    QuizResultResponse getQuizResult(UUID attemptId, UUID studentId);
    
    /**
     * Get all attempts for a quiz
     */
    List<QuizAttemptResponse> getAttemptsByQuiz(UUID quizId);
    
    /**
     * Get student's attempt history for a quiz
     */
    List<QuizAttemptResponse> getStudentAttemptHistory(UUID quizId, UUID studentId);
    
    /**
     * Get all attempts by a student
     */
    List<QuizAttemptResponse> getAllStudentAttempts(UUID studentId);
    
    /**
     * Check if student can attempt quiz
     */
    boolean canStudentAttemptQuiz(UUID quizId, UUID studentId);
    
    /**
     * Get attempt count for student
     */
    Long getAttemptCount(UUID quizId, UUID studentId);
}

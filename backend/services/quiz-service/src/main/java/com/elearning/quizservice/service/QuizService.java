package com.elearning.quizservice.service;

import com.elearning.quizservice.dto.request.CreateQuizRequest;
import com.elearning.quizservice.dto.request.UpdateQuizRequest;
import com.elearning.quizservice.dto.response.QuizDetailResponse;
import com.elearning.quizservice.dto.response.QuizSummaryResponse;
import com.elearning.quizservice.dto.response.StudentQuizSummaryResponse;
import com.elearning.quizservice.entity.Quiz;
import com.elearning.quizservice.entity.StudentQuizStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

/**
 * Service interface for Quiz operations
 */
public interface QuizService {
    
    /**
     * Create a new quiz
     */
    QuizDetailResponse createQuiz(UUID creatorId, CreateQuizRequest request);
    
    /**
     * Get quiz by ID
     */
    Quiz getQuizById(UUID quizId);
    
    /**
     * Get quiz detail response
     */
    QuizDetailResponse getQuizDetail(UUID quizId, boolean includeAnswers);
    
    /**
     * Get all quizzes for a class
     */
    List<QuizSummaryResponse> getQuizzesByClass(UUID classId);
    
    /**
     * Get all quizzes created by a tutor
     */
    List<QuizSummaryResponse> getQuizzesByCreator(UUID creatorId);
    
    /**
     * Get all quizzes for a student with their status and progress
     */
    Page<StudentQuizSummaryResponse> getQuizzesForStudent(UUID studentId, StudentQuizStatus status, Pageable pageable);
    
    /**
     * Update a quiz
     */
    QuizDetailResponse updateQuiz(UUID quizId, UpdateQuizRequest request);
    
    /**
     * Delete a quiz (soft delete)
     */
    void deleteQuiz(UUID quizId);
    
    /**
     * Publish a quiz
     */
    QuizDetailResponse publishQuiz(UUID quizId);
    
    /**
     * Archive a quiz
     */
    void archiveQuiz(UUID quizId);
    
    /**
     * Search quizzes by class
     */
    List<QuizSummaryResponse> searchQuizzes(UUID classId, String searchTerm);
    
    /**
     * Check if quiz is accessible for taking
     */
    void validateQuizAccess(UUID quizId);
}


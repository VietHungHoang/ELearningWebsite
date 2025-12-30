package com.elearning.quizservice.service;

import com.elearning.quizservice.dto.request.CreateQuestionRequest;
import com.elearning.quizservice.dto.response.QuestionResponse;
import com.elearning.quizservice.entity.Question;
import com.elearning.quizservice.entity.QuestionOption;
import com.elearning.quizservice.entity.Quiz;

import java.util.List;
import java.util.UUID;

/**
 * Service interface for Question operations
 */
public interface QuestionService {
    
    /**
     * Create a new question for a quiz
     */
    QuestionResponse createQuestion(UUID quizId, CreateQuestionRequest request);
    
    /**
     * Get question by ID
     */
    Question getQuestionById(UUID questionId);
    
    /**
     * Get question response by ID (for tutor - includes correct answers)
     */
    QuestionResponse getQuestionResponse(UUID questionId);
    
    /**
     * Get question response for student (without correct answers)
     */
    QuestionResponse getQuestionResponseForStudent(UUID questionId);
    
    /**
     * Get all questions for a quiz
     */
    List<Question> getQuestionsByQuizId(UUID quizId);
    
    /**
     * Get all question responses for a quiz
     */
    List<QuestionResponse> getQuestionResponsesByQuizId(UUID quizId, boolean includeAnswers);
    
    /**
     * Update a question
     */
    QuestionResponse updateQuestion(UUID questionId, CreateQuestionRequest request);
    
    /**
     * Delete a question
     */
    void deleteQuestion(UUID questionId);
    
    /**
     * Get options for a question
     */
    List<QuestionOption> getQuestionOptions(UUID questionId);
    
    /**
     * Get correct options for a question
     */
    List<QuestionOption> getCorrectOptions(UUID questionId);
    
    /**
     * Validate question and options
     */
    void validateQuestion(Question question, List<QuestionOption> options);
}

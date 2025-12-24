package com.elearning.quizservice.controller;

import com.elearning.quizservice.dto.request.CreateQuestionRequest;
import com.elearning.quizservice.dto.response.ApiResponse;
import com.elearning.quizservice.dto.response.QuestionResponse;
import com.elearning.quizservice.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for Question management endpoints
 */
@Slf4j
@RestController
@RequestMapping("/api/quizzes/{quizId}/questions")
@RequiredArgsConstructor
public class QuestionController {
    
    private final QuestionService questionService;
    
    /**
     * Create a new question for a quiz
     */
    @PostMapping
    public ResponseEntity<ApiResponse<QuestionResponse>> createQuestion(
            @PathVariable UUID quizId,
            @Valid @RequestBody CreateQuestionRequest request) {
        log.info("Creating question for quiz: {}", quizId);
        
        QuestionResponse response = questionService.createQuestion(quizId, request);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Question created successfully"));
    }
    
    /**
     * Get all questions for a quiz
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<QuestionResponse>>> getQuestions(
            @PathVariable UUID quizId,
            @RequestParam(defaultValue = "true") boolean includeAnswers) {
        log.info("Getting questions for quiz: {}", quizId);
        
        List<QuestionResponse> response = questionService.getQuestionResponsesByQuizId(quizId, includeAnswers);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * Get question by ID
     */
    @GetMapping("/{questionId}")
    public ResponseEntity<ApiResponse<QuestionResponse>> getQuestion(
            @PathVariable UUID quizId,
            @PathVariable UUID questionId) {
        log.info("Getting question: {}", questionId);
        
        QuestionResponse response = questionService.getQuestionResponse(questionId);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * Update a question
     */
    @PutMapping("/{questionId}")
    public ResponseEntity<ApiResponse<QuestionResponse>> updateQuestion(
            @PathVariable UUID quizId,
            @PathVariable UUID questionId,
            @Valid @RequestBody CreateQuestionRequest request) {
        log.info("Updating question: {}", questionId);
        
        QuestionResponse response = questionService.updateQuestion(questionId, request);
        
        return ResponseEntity.ok(ApiResponse.success(response, "Question updated successfully"));
    }
    
    /**
     * Delete a question
     */
    @DeleteMapping("/{questionId}")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(
            @PathVariable UUID quizId,
            @PathVariable UUID questionId) {
        log.info("Deleting question: {}", questionId);
        
        questionService.deleteQuestion(questionId);
        
        return ResponseEntity.ok(ApiResponse.success(null, "Question deleted successfully"));
    }
}

package com.elearning.quizservice.controller;

import com.elearning.quizservice.dto.GenerateQuizRequest;
import com.elearning.quizservice.dto.request.CreateQuizRequest;
import com.elearning.quizservice.dto.request.UpdateQuizRequest;
import com.elearning.quizservice.dto.response.ApiResponse;
import com.elearning.quizservice.dto.response.QuizDetailResponse;
import com.elearning.quizservice.dto.response.QuizStatisticsResponse;
import com.elearning.quizservice.dto.response.QuizSummaryResponse;
import com.elearning.quizservice.service.GeminiQuizService;
import com.elearning.quizservice.service.GradingService;
import com.elearning.quizservice.service.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for Quiz management endpoints (Tutor side)
 */
@Slf4j
@RestController
@RequestMapping("/quizzes")
@RequiredArgsConstructor
public class QuizController {
    
    private final QuizService quizService;
    private final GradingService gradingService;
    private final GeminiQuizService geminiQuizService;
    
    /**
     * Create a new quiz
     */
    @PostMapping
    public ResponseEntity<ApiResponse<QuizDetailResponse>> createQuiz(
            @RequestHeader("X-User-Id") UUID creatorId,
            @Valid @RequestBody CreateQuizRequest request) {
        log.info("Creating quiz for creator: {}", creatorId);
        
        QuizDetailResponse response = quizService.createQuiz(creatorId, request);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Quiz created successfully"));
    }
    
    /**
     * Generate quiz using AI (Gemini) - does NOT save to database
     */
    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<String>> generateQuiz(
            @Valid @RequestBody GenerateQuizRequest request) {
        log.info("Generating quiz with AI. Prompt length: {}", request.getPrompt().length());
        
        String quizJson = geminiQuizService.generateQuiz(request.getPrompt());
        
        return ResponseEntity.ok(
                ApiResponse.success(quizJson, "Quiz generated successfully. This is a preview and not saved."));
    }
    
    /**
     * Get quiz details
     */
    @GetMapping("/{quizId}")
    public ResponseEntity<ApiResponse<QuizDetailResponse>> getQuizDetail(
            @PathVariable UUID quizId,
            @RequestParam(defaultValue = "true") boolean includeAnswers) {
        log.info("Getting quiz detail: {}", quizId);
        
        QuizDetailResponse response = quizService.getQuizDetail(quizId, includeAnswers);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * Get quizzes by class
     */
    @GetMapping("/class/{classId}")
    public ResponseEntity<ApiResponse<List<QuizSummaryResponse>>> getQuizzesByClass(
            @PathVariable UUID classId) {
        log.info("Getting quizzes for class: {}", classId);
        
        List<QuizSummaryResponse> response = quizService.getQuizzesByClass(classId);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * Get quizzes by creator
     */
    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<ApiResponse<List<QuizSummaryResponse>>> getQuizzesByCreator(
            @PathVariable UUID creatorId) {
        log.info("Getting quizzes for creator: {}", creatorId);
        
        List<QuizSummaryResponse> response = quizService.getQuizzesByCreator(creatorId);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * Update quiz
     */
    @PutMapping("/{quizId}")
    public ResponseEntity<ApiResponse<QuizDetailResponse>> updateQuiz(
            @PathVariable UUID quizId,
            @Valid @RequestBody UpdateQuizRequest request) {
        log.info("Updating quiz: {}", quizId);
        
        QuizDetailResponse response = quizService.updateQuiz(quizId, request);
        
        return ResponseEntity.ok(ApiResponse.success(response, "Quiz updated successfully"));
    }
    
    /**
     * Delete quiz
     */
    @DeleteMapping("/{quizId}")
    public ResponseEntity<ApiResponse<Void>> deleteQuiz(@PathVariable UUID quizId) {
        log.info("Deleting quiz: {}", quizId);
        
        quizService.deleteQuiz(quizId);
        
        return ResponseEntity.ok(ApiResponse.success(null, "Quiz deleted successfully"));
    }
    
    /**
     * Publish quiz
     */
    @PostMapping("/{quizId}/publish")
    public ResponseEntity<ApiResponse<QuizDetailResponse>> publishQuiz(@PathVariable UUID quizId) {
        log.info("Publishing quiz: {}", quizId);
        
        QuizDetailResponse response = quizService.publishQuiz(quizId);
        
        return ResponseEntity.ok(ApiResponse.success(response, "Quiz published successfully"));
    }
    
    /**
     * Archive quiz
     */
    @PostMapping("/{quizId}/archive")
    public ResponseEntity<ApiResponse<Void>> archiveQuiz(@PathVariable UUID quizId) {
        log.info("Archiving quiz: {}", quizId);
        
        quizService.archiveQuiz(quizId);
        
        return ResponseEntity.ok(ApiResponse.success(null, "Quiz archived successfully"));
    }
    
    /**
     * Search quizzes
     */
    @GetMapping("/class/{classId}/search")
    public ResponseEntity<ApiResponse<List<QuizSummaryResponse>>> searchQuizzes(
            @PathVariable UUID classId,
            @RequestParam String q) {
        log.info("Searching quizzes in class: {} with query: {}", classId, q);
        
        List<QuizSummaryResponse> response = quizService.searchQuizzes(classId, q);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * Get quiz statistics
     */
    @GetMapping("/{quizId}/statistics")
    public ResponseEntity<ApiResponse<QuizStatisticsResponse>> getQuizStatistics(
            @PathVariable UUID quizId) {
        log.info("Getting statistics for quiz: {}", quizId);
        
        QuizStatisticsResponse response = gradingService.getQuizStatistics(quizId);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

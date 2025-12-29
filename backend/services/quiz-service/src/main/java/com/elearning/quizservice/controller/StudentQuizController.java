package com.elearning.quizservice.controller;

import com.elearning.quizservice.dto.request.SubmitAnswerRequest;
import com.elearning.quizservice.dto.request.SubmitQuizRequest;
import com.elearning.quizservice.dto.response.ApiResponse;
import com.elearning.quizservice.dto.response.QuizAttemptResponse;
import com.elearning.quizservice.dto.response.QuizDetailResponse;
import com.elearning.quizservice.dto.response.QuizResultResponse;
import com.elearning.quizservice.dto.response.StudentQuizSummaryResponse;
import com.elearning.quizservice.entity.StudentQuizStatus;
import com.elearning.quizservice.service.QuizAttemptService;
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
 * REST controller for Student quiz-taking endpoints
 */
@Slf4j
@RestController
@RequestMapping("/api/student/quizzes")
@RequiredArgsConstructor
public class StudentQuizController {
    
    private final QuizService quizService;
    private final QuizAttemptService attemptService;
    
    /**
     * Get all quizzes assigned to student with their status and progress
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentQuizSummaryResponse>>> getStudentQuizzes(
            @RequestHeader("X-User-Id") UUID studentId,
            @RequestParam(required = false) StudentQuizStatus status) {
        log.info("Getting quizzes for student: {} with status filter: {}", studentId, status);
        
        List<StudentQuizSummaryResponse> response = quizService.getQuizzesForStudent(studentId, status);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * Get quiz for student (without answers)
     */
    @GetMapping("/{quizId}")
    public ResponseEntity<ApiResponse<QuizDetailResponse>> getQuizForStudent(
            @PathVariable UUID quizId) {
        log.info("Getting quiz for student: {}", quizId);
        
        QuizDetailResponse response = quizService.getQuizDetail(quizId, false);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * Start a quiz attempt
     */
    @PostMapping("/{quizId}/start")
    public ResponseEntity<ApiResponse<QuizAttemptResponse>> startQuiz(
            @PathVariable UUID quizId,
            @RequestHeader("X-User-Id") UUID studentId) {
        log.info("Student {} starting quiz: {}", studentId, quizId);
        
        QuizAttemptResponse response = attemptService.startQuizAttempt(quizId, studentId);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Quiz attempt started"));
    }
    
    /**
     * Get current in-progress attempt
     */
    @GetMapping("/{quizId}/current-attempt")
    public ResponseEntity<ApiResponse<QuizAttemptResponse>> getCurrentAttempt(
            @PathVariable UUID quizId,
            @RequestHeader("X-User-Id") UUID studentId) {
        log.info("Getting current attempt for student {} on quiz {}", studentId, quizId);
        
        QuizAttemptResponse response = attemptService.getCurrentAttempt(quizId, studentId);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * Save an answer
     */
    @PostMapping("/attempts/{attemptId}/answers")
    public ResponseEntity<ApiResponse<Void>> saveAnswer(
            @PathVariable UUID attemptId,
            @Valid @RequestBody SubmitAnswerRequest request) {
        log.info("Saving answer for attempt: {}", attemptId);
        
        attemptService.saveAnswer(attemptId, request);
        
        return ResponseEntity.ok(ApiResponse.success(null, "Answer saved"));
    }
    
    /**
     * Submit quiz attempt
     */
    @PostMapping("/attempts/{attemptId}/submit")
    public ResponseEntity<ApiResponse<QuizResultResponse>> submitQuiz(
            @PathVariable UUID attemptId,
            @RequestHeader("X-User-Id") UUID studentId,
            @Valid @RequestBody SubmitQuizRequest request) {
        log.info("Student {} submitting attempt: {}", studentId, attemptId);
        
        QuizResultResponse response = attemptService.submitQuizAttempt(attemptId, studentId, request);
        
        return ResponseEntity.ok(ApiResponse.success(response, "Quiz submitted successfully"));
    }
    
    /**
     * Get quiz result
     */
    @GetMapping("/attempts/{attemptId}/result")
    public ResponseEntity<ApiResponse<QuizResultResponse>> getQuizResult(
            @PathVariable UUID attemptId,
            @RequestHeader("X-User-Id") UUID studentId) {
        log.info("Getting result for attempt: {}", attemptId);
        
        QuizResultResponse response = attemptService.getQuizResult(attemptId, studentId);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * Get student's attempt history for a quiz
     */
    @GetMapping("/{quizId}/attempts")
    public ResponseEntity<ApiResponse<List<QuizAttemptResponse>>> getAttemptHistory(
            @PathVariable UUID quizId,
            @RequestHeader("X-User-Id") UUID studentId) {
        log.info("Getting attempt history for student {} on quiz {}", studentId, quizId);
        
        List<QuizAttemptResponse> response = attemptService.getStudentAttemptHistory(quizId, studentId);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * Get all student's quiz attempts
     */
    @GetMapping("/attempts")
    public ResponseEntity<ApiResponse<List<QuizAttemptResponse>>> getAllStudentAttempts(
            @RequestHeader("X-User-Id") UUID studentId) {
        log.info("Getting all attempts for student: {}", studentId);
        
        List<QuizAttemptResponse> response = attemptService.getAllStudentAttempts(studentId);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * Check if student can attempt quiz
     */
    @GetMapping("/{quizId}/can-attempt")
    public ResponseEntity<ApiResponse<Boolean>> canAttemptQuiz(
            @PathVariable UUID quizId,
            @RequestHeader("X-User-Id") UUID studentId) {
        log.info("Checking if student {} can attempt quiz {}", studentId, quizId);
        
        boolean canAttempt = attemptService.canStudentAttemptQuiz(quizId, studentId);
        
        return ResponseEntity.ok(ApiResponse.success(canAttempt));
    }
}

package com.elearning.quiz.controller;

import com.elearning.quiz.dto.QuizAttemptDto;
import com.elearning.quiz.service.QuizAttemptService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz-attempts")
@Tag(name = "Quiz Attempt Management", description = "APIs for managing quiz attempts")
@CrossOrigin(origins = "http://localhost:3000")
public class QuizAttemptController {
    
    @Autowired
    private QuizAttemptService quizAttemptService;
    
    @PostMapping
    @Operation(summary = "Start a new quiz attempt")
    public ResponseEntity<QuizAttemptDto> startQuizAttempt(@Valid @RequestBody QuizAttemptDto attemptDto) {
        QuizAttemptDto createdAttempt = quizAttemptService.startQuizAttempt(attemptDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAttempt);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get quiz attempt by ID")
    public ResponseEntity<QuizAttemptDto> getQuizAttemptById(@PathVariable String id) {
        return quizAttemptService.getQuizAttemptById(id)
                .map(attempt -> ResponseEntity.ok(attempt))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get quiz attempts by student ID")
    public ResponseEntity<List<QuizAttemptDto>> getQuizAttemptsByStudentId(@PathVariable String studentId) {
        List<QuizAttemptDto> attempts = quizAttemptService.getQuizAttemptsByStudentId(studentId);
        return ResponseEntity.ok(attempts);
    }
    
    @GetMapping("/quiz/{quizId}")
    @Operation(summary = "Get quiz attempts by quiz ID")
    public ResponseEntity<List<QuizAttemptDto>> getQuizAttemptsByQuizId(@PathVariable String quizId) {
        List<QuizAttemptDto> attempts = quizAttemptService.getQuizAttemptsByQuizId(quizId);
        return ResponseEntity.ok(attempts);
    }
    
    @GetMapping("/student/{studentId}/quiz/{quizId}")
    @Operation(summary = "Get quiz attempts by student and quiz ID")
    public ResponseEntity<List<QuizAttemptDto>> getQuizAttemptsByStudentAndQuiz(
            @PathVariable String studentId, 
            @PathVariable String quizId) {
        List<QuizAttemptDto> attempts = quizAttemptService.getQuizAttemptsByStudentAndQuiz(studentId, quizId);
        return ResponseEntity.ok(attempts);
    }
    
    @PutMapping("/{id}/answers")
    @Operation(summary = "Update quiz attempt answers")
    public ResponseEntity<QuizAttemptDto> updateQuizAttemptAnswers(
            @PathVariable String id, 
            @RequestBody QuizAttemptDto attemptDto) {
        try {
            QuizAttemptDto updatedAttempt = quizAttemptService.updateQuizAttemptAnswers(id, attemptDto);
            return ResponseEntity.ok(updatedAttempt);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{id}/submit")
    @Operation(summary = "Submit quiz attempt")
    public ResponseEntity<QuizAttemptDto> submitQuizAttempt(@PathVariable String id) {
        try {
            QuizAttemptDto submittedAttempt = quizAttemptService.submitQuizAttempt(id);
            return ResponseEntity.ok(submittedAttempt);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/course/{courseId}")
    @Operation(summary = "Get quiz attempts by course ID")
    public ResponseEntity<List<QuizAttemptDto>> getQuizAttemptsByCourseId(@PathVariable String courseId) {
        List<QuizAttemptDto> attempts = quizAttemptService.getQuizAttemptsByCourseId(courseId);
        return ResponseEntity.ok(attempts);
    }
    
    @GetMapping("/section/{sectionId}")
    @Operation(summary = "Get quiz attempts by section ID")
    public ResponseEntity<List<QuizAttemptDto>> getQuizAttemptsBySectionId(@PathVariable String sectionId) {
        List<QuizAttemptDto> attempts = quizAttemptService.getQuizAttemptsBySectionId(sectionId);
        return ResponseEntity.ok(attempts);
    }
}

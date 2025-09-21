package com.elearning.quiz.controller;

import com.elearning.quiz.dto.QuizQuestionDto;
import com.elearning.quiz.service.QuizQuestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes/{quizId}/questions")
@Tag(name = "Quiz Question Management", description = "APIs for managing quiz questions")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class QuizQuestionController {
    
    @Autowired
    private QuizQuestionService quizQuestionService;
    
    @PostMapping
    @Operation(summary = "Create a new question for quiz")
    public ResponseEntity<QuizQuestionDto> createQuestion(
            @PathVariable String quizId, 
            @Valid @RequestBody QuizQuestionDto questionDto) {
        try {
            System.out.println("🔍 Creating question for quiz: " + quizId);
            System.out.println("📝 Question data: " + questionDto);
            
            questionDto.setQuizId(quizId);
            QuizQuestionDto createdQuestion = quizQuestionService.createQuestion(questionDto);
            
            System.out.println("✅ Question created successfully: " + createdQuestion.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdQuestion);
        } catch (Exception e) {
            System.err.println("❌ Error creating question: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping
    @Operation(summary = "Get all questions for a quiz")
    public ResponseEntity<List<QuizQuestionDto>> getQuestionsByQuizId(@PathVariable String quizId) {
        List<QuizQuestionDto> questions = quizQuestionService.getQuestionsByQuizId(quizId);
        return ResponseEntity.ok(questions);
    }
    
    @GetMapping("/{questionId}")
    @Operation(summary = "Get question by ID")
    public ResponseEntity<QuizQuestionDto> getQuestionById(
            @PathVariable String quizId, 
            @PathVariable String questionId) {
        return quizQuestionService.getQuestionById(questionId)
                .map(question -> ResponseEntity.ok(question))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{questionId}")
    @Operation(summary = "Update question")
    public ResponseEntity<QuizQuestionDto> updateQuestion(
            @PathVariable String quizId,
            @PathVariable String questionId, 
            @Valid @RequestBody QuizQuestionDto questionDto) {
        try {
            questionDto.setId(questionId);
            questionDto.setQuizId(quizId);
            QuizQuestionDto updatedQuestion = quizQuestionService.updateQuestion(questionDto);
            return ResponseEntity.ok(updatedQuestion);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{questionId}")
    @Operation(summary = "Delete question")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable String quizId,
            @PathVariable String questionId) {
        try {
            quizQuestionService.deleteQuestion(questionId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PatchMapping("/reorder")
    @Operation(summary = "Reorder questions")
    public ResponseEntity<Void> reorderQuestions(
            @PathVariable String quizId,
            @RequestBody List<QuizQuestionDto> questions) {
        quizQuestionService.reorderQuestions(questions);
        return ResponseEntity.ok().build();
    }
}

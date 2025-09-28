package com.elearning.quiz.controller;

import com.elearning.quiz.dto.QuizDto;
import com.elearning.quiz.dto.QuizQuestionDto;
import com.elearning.quiz.dto.GenerateQuestionsRequest;
import com.elearning.quiz.model.QuizAttempt;
import com.elearning.quiz.repository.QuizAttemptRepository;
import com.elearning.quiz.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quizzes")
@Tag(name = "Quiz Management", description = "APIs for managing quizzes")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class QuizController {
    
    @Autowired
    private QuizService quizService;
    
    @Autowired
    private QuizAttemptRepository quizAttemptRepository;
    
    @PostMapping
    @Operation(summary = "Create a new quiz")
    public ResponseEntity<QuizDto> createQuiz(@Valid @RequestBody QuizDto quizDto) {
        QuizDto createdQuiz = quizService.createQuiz(quizDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdQuiz);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get quiz by ID")
    public ResponseEntity<QuizDto> getQuizById(@PathVariable String id) {
        return quizService.getQuizById(id)
                .map(quiz -> ResponseEntity.ok(quiz))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/section/{sectionId}")
    @Operation(summary = "Get quiz by section ID")
    public ResponseEntity<QuizDto> getQuizBySectionId(@PathVariable String sectionId) {
        return quizService.getQuizBySectionId(sectionId)
                .map(quiz -> ResponseEntity.ok(quiz))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/tutor/{tutorId}")
    @Operation(summary = "Get quizzes by tutor ID")
    public ResponseEntity<List<QuizDto>> getQuizzesByTutorId(@PathVariable String tutorId) {
        List<QuizDto> quizzes = quizService.getQuizzesByTutorId(tutorId);
        return ResponseEntity.ok(quizzes);
    }
    
    @GetMapping("/course/{courseId}")
    @Operation(summary = "Get quizzes by course ID")
    public ResponseEntity<List<QuizDto>> getQuizzesByCourseId(@PathVariable String courseId) {
        List<QuizDto> quizzes = quizService.getQuizzesByCourseId(courseId);
        return ResponseEntity.ok(quizzes);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update quiz")
    public ResponseEntity<QuizDto> updateQuiz(@PathVariable String id, @Valid @RequestBody QuizDto quizDto) {
        try {
            System.out.println("🔄 Updating quiz ID: " + id);
            System.out.println("📝 Quiz data: " + quizDto);
            
            QuizDto updatedQuiz = quizService.updateQuiz(id, quizDto);
            
            System.out.println("✅ Quiz updated successfully: " + updatedQuiz.getId());
            return ResponseEntity.ok(updatedQuiz);
        } catch (RuntimeException e) {
            System.err.println("❌ Error updating quiz: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("❌ Unexpected error updating quiz: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete quiz")
    public ResponseEntity<Void> deleteQuiz(@PathVariable String id) {
        try {
            quizService.deleteQuiz(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search quizzes by title")
    public ResponseEntity<List<QuizDto>> searchQuizzes(@RequestParam String title) {
        List<QuizDto> quizzes = quizService.searchQuizzesByTitle(title);
        return ResponseEntity.ok(quizzes);
    }
    
    @GetMapping
    @Operation(summary = "Get all active quizzes")
    public ResponseEntity<List<QuizDto>> getAllActiveQuizzes() {
        List<QuizDto> quizzes = quizService.getAllActiveQuizzes();
        return ResponseEntity.ok(quizzes);
    }
    
    @GetMapping("/tutor/{tutorId}/count")
    @Operation(summary = "Get quiz count by tutor ID")
    public ResponseEntity<Long> getQuizCountByTutorId(@PathVariable String tutorId) {
        Long count = quizService.countQuizzesByTutorId(tutorId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/student/{studentId}/course/{courseId}/completion-status")
    @Operation(summary = "Get quiz completion status for a student in a course")
    public ResponseEntity<Map<String, Object>> getQuizCompletionStatus(
            @PathVariable String studentId, 
            @PathVariable String courseId) {
        try {
            System.out.println("🎯 Getting quiz completion status for student: " + studentId + ", course: " + courseId);
            
            // Get all quiz attempts for this student in this course
            List<QuizAttempt> attempts = quizAttemptRepository.findByStudentIdAndCourseIdOrderByCreatedAtDesc(studentId, courseId);
            
            // Group by section and check if passed
            Map<String, Boolean> sectionCompletionStatus = new HashMap<>();
            for (QuizAttempt attempt : attempts) {
                if (attempt.getPassed()) {
                    sectionCompletionStatus.put(attempt.getSectionId(), true);
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("studentId", studentId);
            response.put("courseId", courseId);
            response.put("sectionCompletionStatus", sectionCompletionStatus);
            response.put("totalAttempts", attempts.size());
            response.put("passedAttempts", attempts.stream().mapToInt(a -> a.getPassed() ? 1 : 0).sum());
            
            System.out.println("✅ Quiz completion status retrieved: " + sectionCompletionStatus);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error getting quiz completion status: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{quizId}/complete")
    @Operation(summary = "Complete a quiz and update progress")
    public ResponseEntity<Map<String, Object>> completeQuiz(
            @PathVariable String quizId,
            @RequestBody Map<String, Object> request) {
        try {
            System.out.println("🎯 Quiz completion request for quiz: " + quizId);
            System.out.println("📝 Request data: " + request);
            
            // Extract data from request
            String studentId = (String) request.get("studentId");
            Integer score = (Integer) request.get("score");
            Boolean passed = (Boolean) request.get("passed");
            String sectionId = (String) request.get("sectionId");
            String courseId = (String) request.get("courseId");
            
            // Calculate additional fields
            Integer correctAnswers = score != null ? score : 0;
            Integer totalQuestions = 3; // Default, should be calculated from quiz
            Double percentage = score != null ? score.doubleValue() : 0.0;
            Integer timeSpent = 0; // Default, should be calculated from frontend
            
            // Save quiz attempt to database
            QuizAttempt attempt = new QuizAttempt(quizId, sectionId, courseId, studentId, score, passed, 
                                                correctAnswers, totalQuestions, percentage, timeSpent);
            QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);
            
            System.out.println("💾 Quiz attempt saved to database with ID: " + savedAttempt.getId());
            
            // Create response
            Map<String, Object> response = new HashMap<>();
            response.put("attemptId", savedAttempt.getId());
            response.put("quizId", quizId);
            response.put("studentId", studentId);
            response.put("score", score);
            response.put("passed", passed);
            response.put("sectionId", sectionId);
            response.put("courseId", courseId);
            response.put("completedAt", savedAttempt.getCompletedAt().toString());
            response.put("message", "Quiz completed successfully and saved to database");
            
            System.out.println("✅ Quiz completion processed and saved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error processing quiz completion: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/questions/generate")
    @Operation(summary = "Generate questions using AI")
    public ResponseEntity<List<QuizQuestionDto>> generateQuestions(
            @PathVariable String id,
            @RequestBody GenerateQuestionsRequest request) {
        try {
            System.out.println("🤖 Generating questions for quiz: " + id);
            System.out.println("📝 Request: " + request);
            
            List<QuizQuestionDto> generatedQuestions = quizService.generateQuestions(id, request);
            
            System.out.println("✅ Generated " + generatedQuestions.size() + " questions");
            return ResponseEntity.ok(generatedQuestions);
        } catch (Exception e) {
            System.err.println("❌ Error generating questions: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}

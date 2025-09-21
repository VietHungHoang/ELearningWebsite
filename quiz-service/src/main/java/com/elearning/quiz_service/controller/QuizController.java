package com.elearning.quiz_service.controller;

import java.util.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.elearning.quiz_service.dto.request.QuizRequest;
import com.elearning.quiz_service.dto.request.SubmitAnswerRequest;
import com.elearning.quiz_service.dto.response.ApiResponse;
import com.elearning.quiz_service.dto.response.QuizQuestionResponse;
import com.elearning.quiz_service.dto.response.QuizResponse;
import com.elearning.quiz_service.dto.response.QuizResultResponse;
import com.elearning.quiz_service.dto.response.SubmitAnswerResponse;
import com.elearning.quiz_service.service.IQuizService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final IQuizService quizService;

    // 1. Lấy tất cả quiz theo lesson
    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<ApiResponse<List<QuizResponse>>> getAllByLesson(@PathVariable Long lessonId) {
        List<QuizResponse> list = quizService.getAllQuizzesByLesson(lessonId);
        ApiResponse<List<QuizResponse>> response = new ApiResponse<>(200, "Get all quizzes by lesson success", list);
        return ResponseEntity.ok(response);
    }

    // 2. Lấy quiz theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<QuizResponse>> getById(@PathVariable Long id) {
        return quizService.getQuiz(id)
                .map(quiz -> ResponseEntity.ok(
                        new ApiResponse<>(200, "Get quiz by id success", quiz)))
                .orElse(ResponseEntity.status(404)
                        .body(new ApiResponse<>(404, "Quiz not found", null)));
    }

    // 3. Tạo quiz mới
    @PostMapping
    public ResponseEntity<ApiResponse<QuizResponse>> create(@RequestBody QuizRequest request) {
        QuizResponse quiz = quizService.saveQuiz(request);
        return ResponseEntity.ok(new ApiResponse<>(200, "Create quiz success", quiz));
    }

    // 4. Lấy câu hỏi theo quiz và index
    @GetMapping("/{id}/question/{questionIndex}")
    public ResponseEntity<ApiResponse<QuizQuestionResponse>> getQuestion(
            @PathVariable Long id,
            @PathVariable int questionIndex) {
        return quizService.getQuestion(id, questionIndex)
                .map(q -> ResponseEntity.ok(
                        new ApiResponse<>(200, "Get quiz question success", q)))
                .orElse(ResponseEntity.status(404)
                        .body(new ApiResponse<>(404, "Question not found", null)));
    }

    // 5. Trả lời câu hỏi
    @PostMapping("/{id}/answer")
    public ResponseEntity<ApiResponse<SubmitAnswerResponse>> submitAnswer(
            @PathVariable Long id,
            @RequestBody SubmitAnswerRequest request) {
        SubmitAnswerResponse answer = quizService.submitAnswer(id, request);
        return ResponseEntity.ok(new ApiResponse<>(200, "Submit answer success", answer));
    }

    // 6. Cập nhật trạng thái quiz (DRAFT -> PUBLISHED)
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<QuizResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status // ví dụ ?status=PUBLISHED
    ) {
        QuizResponse updated = quizService.updateQuizStatus(id, status);
        return ResponseEntity.ok(new ApiResponse<>(200, "Update quiz status success", updated));
    }

    // 7. Xem kết quả làm quiz của 1 user
    @GetMapping("/results/{userId}")
    public ResponseEntity<ApiResponse<List<QuizResultResponse>>> getResultsByUser(@PathVariable Long userId) {
        List<QuizResultResponse> results = quizService.getResultsByUser(userId);
        return ResponseEntity.ok(new ApiResponse<>(200, "Get quiz results success", results));
    }
}

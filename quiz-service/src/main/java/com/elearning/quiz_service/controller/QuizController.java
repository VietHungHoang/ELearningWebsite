package com.elearning.quiz_service.controller;
import java.util.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.elearning.quiz_service.dto.request.QuizRequest;
import com.elearning.quiz_service.dto.request.SubmitAnswerRequest;
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
    public List<QuizResponse> getAllByLesson(@PathVariable Long lessonId) {
        return quizService.getAllQuizzesByLesson(lessonId);
    }

    // 2. Lấy quiz theo ID
    @GetMapping("/{id}")
    public ResponseEntity<QuizResponse> getById(@PathVariable Long id) {
        return quizService.getQuiz(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Tạo quiz mới
    @PostMapping
    public QuizResponse create(@RequestBody QuizRequest request) {
        return quizService.saveQuiz(request);
    }

    // 4. Lấy câu hỏi theo quiz và index
    @GetMapping("/{id}/question/{questionIndex}")
    public ResponseEntity<QuizQuestionResponse> getQuestion(
            @PathVariable Long id,
            @PathVariable int questionIndex) {
        return quizService.getQuestion(id, questionIndex)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 5. Trả lời câu hỏi
    @PostMapping("/{id}/answer")
    public SubmitAnswerResponse submitAnswer(
            @PathVariable Long id,
            @RequestBody SubmitAnswerRequest request) {
        return quizService.submitAnswer(id, request);
    }

    // 6. Cập nhật trạng thái quiz (DRAFT -> PUBLISHED)
    @PutMapping("/{id}/status")
    public QuizResponse updateStatus(
            @PathVariable Long id,
            @RequestParam String status // ví dụ ?status=PUBLISHED
    ) {
        return quizService.updateQuizStatus(id, status);
    }

    // 7. Xem kết quả làm quiz của 1 user
    @GetMapping("/results/{userId}")
    public List<QuizResultResponse> getResultsByUser(@PathVariable Long userId) {
        return quizService.getResultsByUser(userId);
    }
}

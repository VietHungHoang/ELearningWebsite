package com.elearning.learner_service.controller;

import com.elearning.learner_service.dto.request.QuizAttemptRequest;
import com.elearning.learner_service.dto.response.ApiResponse;
import com.elearning.learner_service.dto.response.QuizAttemptResponse;
import com.elearning.learner_service.service.QuizAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/learners/quiz-attempts")
@RequiredArgsConstructor
public class QuizAttemptController {

    private final QuizAttemptService quizAttemptService;

    @PostMapping
    public ApiResponse<QuizAttemptResponse> createAttempt(@RequestBody QuizAttemptRequest request) {
        return ApiResponse.success(quizAttemptService.createAttempt(request), "Tạo quiz attempt thành công");
    }

    @GetMapping("/{accountId}")
    public ApiResponse<List<QuizAttemptResponse>> getMyAttempts(@PathVariable Long accountId) {
        return ApiResponse.success(quizAttemptService.getMyAttempts(accountId),
                "Lấy danh sách quiz attempt thành công");
    }
}

package com.elearning.apigateway.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import com.elearning.apigateway.dto.request.QuizAttemptRequest;
import com.elearning.apigateway.dto.response.ApiResponse;
import com.elearning.apigateway.service.QuizAttemptService;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/learners/quiz-attempts")
@RequiredArgsConstructor
public class QuizAttemptController {

    private final QuizAttemptService quizAttemptService;

    @PostMapping
    public ApiResponse<Map<String, Object>> createAttempt(@RequestBody QuizAttemptRequest request) {
        return ApiResponse.success(quizAttemptService.createAttempt(request), "Tạo bài thi thành công");
    }

    @GetMapping("/{accountId}")
    public ApiResponse<List<Map<String, Object>>> getMyAttempts(@PathVariable Long accountId) {
        return ApiResponse.success(quizAttemptService.getMyAttempts(accountId), "Lấy danh sách bài thi thành công");
    }
}


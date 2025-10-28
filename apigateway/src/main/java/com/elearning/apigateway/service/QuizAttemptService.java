package com.elearning.apigateway.service;

import java.util.List;
import java.util.Map;

import com.elearning.apigateway.dto.request.QuizAttemptRequest;

public interface QuizAttemptService {
    Map<String, Object> createAttempt(QuizAttemptRequest request);

    List<Map<String, Object>> getMyAttempts(Long accountId);
}


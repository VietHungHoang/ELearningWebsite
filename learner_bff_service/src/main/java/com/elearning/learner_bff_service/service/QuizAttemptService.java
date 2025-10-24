package com.elearning.learner_bff_service.service;

import com.elearning.learner_bff_service.dto.request.QuizAttemptRequest;
import java.util.List;
import java.util.Map;

public interface QuizAttemptService {
    Map<String, Object> createAttempt(QuizAttemptRequest request);

    List<Map<String, Object>> getMyAttempts(Long accountId);
}

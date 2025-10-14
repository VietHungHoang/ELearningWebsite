package com.elearning.learner_service.service;

import com.elearning.learner_service.dto.request.QuizAttemptRequest;
import com.elearning.learner_service.dto.response.QuizAttemptResponse;

import java.util.List;

public interface QuizAttemptService {
    QuizAttemptResponse createAttempt(QuizAttemptRequest request);
    List<QuizAttemptResponse> getMyAttempts(Long accountId);
}

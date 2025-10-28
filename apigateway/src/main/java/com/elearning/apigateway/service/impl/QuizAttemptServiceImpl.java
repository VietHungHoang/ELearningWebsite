package com.elearning.apigateway.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.elearning.apigateway.client.LearnerServiceClient;
import com.elearning.apigateway.dto.request.QuizAttemptRequest;
import com.elearning.apigateway.service.QuizAttemptService;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuizAttemptServiceImpl implements QuizAttemptService {

    private final LearnerServiceClient learnerServiceClient;

    @Override
    public Map<String, Object> createAttempt(QuizAttemptRequest request) {
        log.info("BFF Service: Tạo bài thi cho accountId: {}, courseId: {}", request.getAccountId(),
                request.getCourseId());
        return learnerServiceClient.createQuizAttempt(request);
    }

    @Override
    public List<Map<String, Object>> getMyAttempts(Long accountId) {
        log.info("BFF Service: Lấy danh sách bài thi cho accountId: {}", accountId);
        return learnerServiceClient.getMyQuizAttempts(accountId);
    }
}


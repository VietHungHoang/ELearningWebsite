package com.elearning.apigateway.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.elearning.apigateway.client.LearnerServiceClient;
import com.elearning.apigateway.dto.request.ReviewRequest;
import com.elearning.apigateway.service.ReviewService;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final LearnerServiceClient learnerServiceClient;

    @Override
    public Map<String, Object> createReview(ReviewRequest request) {
        log.info("BFF Service: Creating review for accountId: {}, courseId: {}", request.getAccountId(),
                request.getCourseId());
        return learnerServiceClient.createReview(request);
    }

    @Override
    public Map<String, Object> updateReview(ReviewRequest request) {
        log.info("BFF Service: Updating review for accountId: {}, courseId: {}", request.getAccountId(),
                request.getCourseId());
        return learnerServiceClient.updateReview(request);
    }

    @Override
    public void deleteReview(Long accountId, Long courseId) {
        log.info("BFF Service: Deleting review for accountId: {}, courseId: {}", accountId, courseId);
        learnerServiceClient.deleteReview(accountId, courseId);
    }

    @Override
    public List<Map<String, Object>> getMyReviews(Long accountId) {
        log.info("BFF Service: Getting reviews for accountId: {}", accountId);
        return learnerServiceClient.getMyReviews(accountId);
    }
}


package com.elearning.apigateway.service;

import java.util.List;
import java.util.Map;

import com.elearning.apigateway.dto.request.ReviewRequest;

public interface ReviewService {
    Map<String, Object> createReview(ReviewRequest request);

    Map<String, Object> updateReview(ReviewRequest request);

    void deleteReview(Long accountId, Long courseId);

    List<Map<String, Object>> getMyReviews(Long accountId);
}


package com.elearning.learner_service.service;

import com.elearning.learner_service.dto.request.ReviewRequest;
import com.elearning.learner_service.dto.response.ReviewResponse;

import java.util.List;

public interface ReviewService {
    ReviewResponse createReview(ReviewRequest request);

    ReviewResponse updateReview(ReviewRequest request);

    void deleteReview(Long accountId, Long courseId);

    List<ReviewResponse> getMyReviews(Long accountId);
}

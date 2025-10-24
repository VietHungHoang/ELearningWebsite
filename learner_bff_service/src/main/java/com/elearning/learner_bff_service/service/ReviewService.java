package com.elearning.learner_bff_service.service;

import com.elearning.learner_bff_service.dto.request.ReviewRequest;
import java.util.List;
import java.util.Map;

public interface ReviewService {
    Map<String, Object> createReview(ReviewRequest request);

    Map<String, Object> updateReview(ReviewRequest request);

    void deleteReview(Long accountId, Long courseId);

    List<Map<String, Object>> getMyReviews(Long accountId);
}

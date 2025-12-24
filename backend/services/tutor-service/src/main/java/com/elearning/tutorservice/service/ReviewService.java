package com.elearning.tutorservice.service;

import com.elearning.tutorservice.dto.review.request.CreateReviewRequest;
import com.elearning.tutorservice.dto.review.response.ReviewResponse;

import java.util.List;
import java.util.UUID;

public interface ReviewService {
    
    /**
     * Create a new review with automatic moderation
     * @param request Review creation request
     * @return Created review with moderation status
     */
    ReviewResponse createReview(CreateReviewRequest request);
    
    /**
     * Get all approved reviews for a tutor
     * @param tutorId Tutor ID
     * @return List of approved reviews
     */
    List<ReviewResponse> getReviewsByTutorId(UUID tutorId);
}

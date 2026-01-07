package com.elearning.tutorservice.service;

import com.elearning.tutorservice.dto.review.request.CreateReviewRequest;
import com.elearning.tutorservice.dto.review.response.ReviewResponse;

import java.util.List;
import java.util.UUID;

public interface ReviewService {

    /**
     * Create a new review with automatic moderation
     * 
     * @param request Review creation request
     * @return Created review with moderation status
     */
    ReviewResponse createReview(CreateReviewRequest request);

    /**
     * Get all approved reviews for a tutor
     * 
     * @param tutorId Tutor ID
     * @return List of approved reviews
     */
    List<ReviewResponse> getReviewsByTutorId(UUID tutorId);

    /**
     * Get reviews for a tutor:
     * - All APPROVED reviews (visible to everyone)
     * - Non-approved reviews of the current student (visible to reviewer only)
     * 
     * @param tutorId   Tutor ID
     * @param studentId Current student ID (optional, can be null for
     *                  unauthenticated users)
     * @return Combined list of reviews
     */
    List<ReviewResponse> getReviewsForTutor(UUID tutorId, UUID studentId);
}

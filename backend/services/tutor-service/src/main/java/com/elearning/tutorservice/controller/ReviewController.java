package com.elearning.tutorservice.controller;

import com.elearning.tutorservice.dto.response.ApiResponse;
import com.elearning.tutorservice.dto.review.request.CreateReviewRequest;
import com.elearning.tutorservice.dto.review.response.ReviewResponse;
import com.elearning.tutorservice.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@Slf4j
public class ReviewController {

        private final ReviewService reviewService;

        /**
         * POST /api/v1/reviews
         * Create a new review with automatic content moderation
         */
        @PostMapping
        public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
                        @Valid @RequestBody CreateReviewRequest request) {

                log.info("Creating review for tutor: {} from student: {}",
                                request.getTutorId(), request.getStudentId());

                ReviewResponse review = reviewService.createReview(request);

                // Return different response based on moderation result
                if (review.getModerationStatus() == com.elearning.tutorservice.enums.ReviewModerationStatus.REJECTED) {
                        // HTTP 200 but business error code indicates rejection
                        return ResponseEntity.ok(
                                        ApiResponse.businessError(
                                                        review.getErrorCode(),
                                                        "Review rejected: " + review.getErrorMessage()));
                }

                // HTTP 200, success
                return ResponseEntity.ok(
                                ApiResponse.success(review, "Review created and approved successfully"));
        }

        /**
         * GET /reviews/tutors/{tutorId}
         * Get reviews for a specific tutor:
         * - All APPROVED reviews (visible to everyone)
         * - Non-approved reviews of current user (if logged in)
         */
        @GetMapping("/tutors/{tutorId}")
        public ResponseEntity<ApiResponse<List<ReviewResponse>>> getReviewsForTutor(
                        @PathVariable UUID tutorId,
                        @RequestHeader(value = "X-User-Id", required = false) UUID studentId) {

                log.info("Getting reviews for tutor: {}, current user: {}", tutorId, studentId);

                List<ReviewResponse> reviews = reviewService.getReviewsForTutor(tutorId, studentId);

                return ResponseEntity.ok(
                                ApiResponse.success(reviews, "Reviews retrieved successfully"));
        }
}
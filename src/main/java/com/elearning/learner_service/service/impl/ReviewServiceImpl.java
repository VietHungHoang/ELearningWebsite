package com.elearning.learner_service.service.impl;

import com.elearning.learner_service.client.CourseServiceClient;
import com.elearning.learner_service.dto.request.ReviewRequest;
import com.elearning.learner_service.dto.response.ReviewResponse;
import com.elearning.learner_service.model.Review;
import com.elearning.learner_service.repository.ReviewRepository;
import com.elearning.learner_service.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final CourseServiceClient courseServiceClient;

    @Override
    public ReviewResponse createReview(ReviewRequest request) {
        Review existing = reviewRepository.findByAccountIdAndCourseId(
                request.getAccountId(), request.getCourseId());
        if (existing != null) {
            throw new RuntimeException("Bạn đã review khóa học này rồi");
        }

        Review review = Review.builder()
                .accountId(request.getAccountId())
                .courseId(request.getCourseId())
                .rating(request.getRating())
                .comment(request.getComment())
                .createdAt(Instant.now().toEpochMilli())
                .updatedAt(Instant.now().toEpochMilli())
                .build();

        Review saved = reviewRepository.save(review);
        return mapToResponse(saved);
    }

    @Override
    public ReviewResponse updateReview(ReviewRequest request) {
        Review review = reviewRepository.findByAccountIdAndCourseId(
                request.getAccountId(), request.getCourseId());
        if (review == null) {
            throw new RuntimeException("Không tìm thấy review để cập nhật");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setUpdatedAt(Instant.now().toEpochMilli());
        Review updated = reviewRepository.save(review);
        return mapToResponse(updated);
    }

    @Override
    public void deleteReview(Long accountId, Long courseId) {
        Review review = reviewRepository.findByAccountIdAndCourseId(accountId, courseId);
        if (review != null) {
            reviewRepository.delete(review);
        }
    }

    @Override
    public List<ReviewResponse> getMyReviews(Long accountId) {
        return reviewRepository.findByAccountId(accountId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ReviewResponse mapToResponse(Review review) {
        Map<String, Object> courseInfo = courseServiceClient.getCourseInfo(review.getCourseId());

        return ReviewResponse.builder()
                .id(review.getId())
                .accountId(review.getAccountId())
                .courseId(review.getCourseId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .courseTitle((String) courseInfo.get("title"))
                .courseThumbnail((String) courseInfo.get("thumbnail"))
                .totalReviews((Integer) courseInfo.getOrDefault("totalReviews", 0))
                .ratingAverage((Double) courseInfo.getOrDefault("ratingAverage", 0.0))
                .build();
    }
}

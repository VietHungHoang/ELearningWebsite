package com.elearning.tutorservice.service.impl;

import com.elearning.tutorservice.dto.review.request.CreateReviewRequest;
import com.elearning.tutorservice.dto.review.response.ModerationResult;
import com.elearning.tutorservice.dto.review.response.ReviewResponse;
import com.elearning.tutorservice.entity.Tutor;
import com.elearning.tutorservice.entity.TutorReview;
import com.elearning.tutorservice.enums.ReviewModerationStatus;
import com.elearning.tutorservice.enums.ReviewViolationType;
import com.elearning.tutorservice.exception.ResourceNotFoundException;
import com.elearning.tutorservice.repository.TutorRepository;
import com.elearning.tutorservice.repository.TutorReviewRepository;
import com.elearning.tutorservice.service.GeminiModerationService;
import com.elearning.tutorservice.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewServiceImpl implements ReviewService {

    private final TutorReviewRepository tutorReviewRepository;
    private final TutorRepository tutorRepository;
    private final GeminiModerationService geminiModerationService;

    @Override
    @Transactional
    public ReviewResponse createReview(CreateReviewRequest request) {
        log.info("Creating review for tutor: {}, student: {}", request.getTutorId(), request.getStudentId());

        // Verify tutor exists
        Tutor tutor = tutorRepository.findById(request.getTutorId())
                .orElseThrow(() -> new ResourceNotFoundException("Tutor not found with id: " + request.getTutorId()));

        // Moderate review content using Gemini
        ModerationResult moderationResult = geminiModerationService.moderateReview(
                request.getComment(),
                request.getRating()
        );

        log.info("Moderation result - Approved: {}, Code: {}, Reason: {}", 
                moderationResult.isApproved(), 
                moderationResult.getErrorCode(), 
                moderationResult.getReason());

        // Build review entity
        TutorReview review = TutorReview.builder()
                .tutor(tutor)
                .studentId(request.getStudentId())
                .studentName(request.getStudentName())
                .studentAvatarUrl(request.getStudentAvatarUrl())
                .rating(request.getRating())
                .comment(request.getComment())
                .moderationStatus(moderationResult.isApproved() ? 
                        ReviewModerationStatus.APPROVED : ReviewModerationStatus.REJECTED)
                .violationCode(moderationResult.getErrorCode())
                .violationReason(moderationResult.getReason())
                .moderationConfidence(moderationResult.getConfidence())
                .build();

        // Save review
        TutorReview savedReview = tutorReviewRepository.save(review);

        return mapToReviewResponse(savedReview);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByTutorId(UUID tutorId) {
        log.info("Getting approved reviews for tutor: {}", tutorId);

        // Verify tutor exists
        if (!tutorRepository.existsById(tutorId)) {
            throw new ResourceNotFoundException("Tutor not found with id: " + tutorId);
        }

        List<TutorReview> reviews = tutorReviewRepository
                .findByTutorIdAndModerationStatus(tutorId, ReviewModerationStatus.APPROVED);

        return reviews.stream()
                .map(this::mapToReviewResponse)
                .toList();
    }

    private ReviewResponse mapToReviewResponse(TutorReview review) {
        ReviewViolationType violationType = ReviewViolationType.fromCode(
                review.getViolationCode() != null ? review.getViolationCode() : 0
        );

        return ReviewResponse.builder()
                .id(review.getId())
                .tutorId(review.getTutor().getId())
                .studentId(review.getStudentId())
                .studentName(review.getStudentName() != null ? review.getStudentName() : "")
                .studentAvatarUrl(review.getStudentAvatarUrl() != null ? review.getStudentAvatarUrl() : "")
                .rating(review.getRating())
                .comment(review.getComment())
                .moderationStatus(review.getModerationStatus())
                .errorCode(review.getViolationCode())
                .errorMessage(violationType.getDescription())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}

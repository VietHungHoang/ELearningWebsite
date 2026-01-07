package com.elearning.tutorservice.dto.review.response;

import com.elearning.tutorservice.enums.ReviewModerationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {

    private UUID id;
    private UUID tutorId;
    private UUID studentId;
    private String studentName;
    private String studentAvatarUrl;
    private Integer rating;
    private String comment;
    private ReviewModerationStatus moderationStatus;
    private String statusDescription; // Human-readable status description
    private Integer errorCode;
    private String errorMessage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // For Option B: mark if this is the current user's own review (to show
    // pending/rejected)
    @Builder.Default
    private boolean ownReview = false;
}

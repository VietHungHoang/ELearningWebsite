package com.elearning.tutorservice.dto.response;

import com.elearning.tutorservice.enums.ReviewModerationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TutorReviewResponse {
    private UUID id;
    private UUID studentId;
    private String studentName;
    private String studentAvatarUrl;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    // Moderation fields
    private ReviewModerationStatus moderationStatus;
    private String statusDescription;
    private Integer errorCode;
    private String errorMessage;
}

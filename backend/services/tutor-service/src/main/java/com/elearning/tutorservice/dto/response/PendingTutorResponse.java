package com.elearning.tutorservice.dto.response;

import com.elearning.tutorservice.entity.enums.OnboardingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PendingTutorResponse {
    private UUID tutorId;
    private String email;
    private String fullName;
    private String avatarUrl;
    private List<UUID> subjectIds;
    private Integer currentStep;
    private OnboardingStatus status;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

package com.elearning.tutorservice.dto.request;

import com.elearning.tutorservice.entity.enums.OnboardingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOnboardingStatusRequest {
    private OnboardingStatus status;
    private String description;
}
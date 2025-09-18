package com.elearning.learnerservice.dto.response;

import com.elearning.learnerservice.enums.EnrollmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentResponse {
    
    private Long id;
    private Long learnerId;
    private Long courseId;
    private EnrollmentStatus status;
    private BigDecimal paidAmount;
    private String paymentMethod;
    private String transactionId;
    private Integer completedLessons;
    private BigDecimal completionPercentage;
    private LocalDateTime enrolledAt;
    private LocalDateTime completedAt;
    private LocalDateTime accessExpiresAt;
    private LocalDateTime updatedAt;
    private String certificateUrl;
    private LocalDateTime certificateIssuedAt;
    private Integer totalWatchTimeMinutes;
    private LocalDateTime lastAccessedAt;
    private String enrollmentSource;
    private String notes;
}

package com.elearning.apigateway.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentResponse {

    private Long enrollmentId;
    private Long accountId;
    private Long courseId;
    private String status;
    private LocalDateTime enrolledDate;
    private LocalDateTime completedDate;
    private Double progressPercentage;
}


package com.elearning.learnerservice.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateEnrollmentRequest {
    
    @NotNull(message = "Course ID is required")
    private Long courseId;
    
    private BigDecimal paidAmount;
    private String paymentMethod;
    private String transactionId;
    private String enrollmentSource;
}

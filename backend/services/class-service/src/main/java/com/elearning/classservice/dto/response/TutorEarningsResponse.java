package com.elearning.classservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorEarningsResponse {
    private UUID id;
    private UUID sessionId;
    private BigDecimal amount;
    private String status;
    private LocalDateTime paidAt;
    private UUID paymentId;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
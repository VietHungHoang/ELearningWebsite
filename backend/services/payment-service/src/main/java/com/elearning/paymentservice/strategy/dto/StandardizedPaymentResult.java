package com.elearning.paymentservice.strategy.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StandardizedPaymentResult {
    private String orderId;
    private String providerTransactionId;
    private String status; // e.g., SUCCESS, FAILED, PENDING
}

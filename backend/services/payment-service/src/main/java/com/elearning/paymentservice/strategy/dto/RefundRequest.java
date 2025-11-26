package com.elearning.paymentservice.strategy.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class RefundRequest {
    private String providerTransactionId;
    private BigDecimal amount;
    private String reason;
}

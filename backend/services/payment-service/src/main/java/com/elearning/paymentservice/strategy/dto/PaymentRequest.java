package com.elearning.paymentservice.strategy.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PaymentRequest {
    private Long orderId;
    private BigDecimal amount;
    private String currency;
    private String redirectUrl;
}

package com.elearning.paymentservice.dto.event;

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
public class PaymentRefundedEvent {
    private Long paymentId;
    private UUID orderId;
    private BigDecimal amount;
    private String currency;
    private String paymentProvider;
    private String providerTransactionId;
    private String refundReason;
    private LocalDateTime refundedAt;
    private UUID userId; // Optional: user who requested the refund
}
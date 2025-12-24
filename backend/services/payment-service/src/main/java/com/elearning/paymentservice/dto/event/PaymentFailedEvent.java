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
public class PaymentFailedEvent {
    private UUID paymentId;
    private UUID orderId;
    private BigDecimal amount;
    private String currency;
    private String paymentProvider;
    private String providerTransactionId;
    private String failureReason;
    private LocalDateTime failedAt;
    private UUID userId; // Optional: user who attempted the payment
}
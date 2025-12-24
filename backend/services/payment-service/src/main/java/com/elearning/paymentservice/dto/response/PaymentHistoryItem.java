package com.elearning.paymentservice.dto.response;

import com.elearning.paymentservice.enums.PaymentGateway;
import com.elearning.paymentservice.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentHistoryItem {
    private String id;
    private String date;
    private BigDecimal amount;
    private PaymentGateway method;
    private PaymentStatus status;
}
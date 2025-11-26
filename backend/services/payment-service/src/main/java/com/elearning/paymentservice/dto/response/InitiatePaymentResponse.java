package com.elearning.paymentservice.dto.response;

import com.elearning.paymentservice.enums.PaymentMethodType;
import com.elearning.paymentservice.enums.PaymentGateway;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// paymentId is a Long (DB auto-generated id)

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InitiatePaymentResponse {

    // Unique ID of the transaction stored in payment-service DB
    private Long paymentId;

    // Which provider will handle this payment (MOMO, VNPAY, ...)
    private PaymentGateway provider;

    // Initial status (PENDING)
    private String status;

    // How the client should proceed: REDIRECT, QR_CODE, SDK
    private PaymentMethodType paymentMethodType;

    // Provider specific data: redirectUrl, qrCodeContent, sdkParameters
    private PaymentData paymentData;
}
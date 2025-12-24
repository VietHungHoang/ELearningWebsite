package com.elearning.bookingservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePaymentResponse {

    // Unique ID of the transaction stored in payment-service DB
    private UUID paymentId;

    // Which provider will handle this payment (MOMO, VNPAY, ...)
    private String provider;

    // Initial status (PENDING)
    private String status;

    // How the client should proceed: REDIRECT, QR_CODE, SDK
    private String paymentMethodType;

    // Provider specific data: redirectUrl, qrCodeContent, sdkParameters
    private PaymentData paymentData;

    @Data
    @Builder
    public static class PaymentData {
        private String redirectUrl;
        private String qrCodeContent;
        private java.util.Map<String, Object> sdkParameters;
    }
}
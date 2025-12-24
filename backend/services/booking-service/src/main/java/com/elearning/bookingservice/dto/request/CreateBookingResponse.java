package com.elearning.bookingservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingResponse {

    private UUID bookingId;
    private UUID paymentId;
    private String provider;
    private String status;
    private String paymentMethodType;
    private PaymentData paymentData;

    @Data
    @Builder
    public static class PaymentData {
        private String redirectUrl;
        private String qrCodeContent;
        private java.util.Map<String, Object> sdkParameters;
    }
}
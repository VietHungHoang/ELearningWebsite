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
public class CreatePaymentRequest {

    private UUID orderId;
    private UUID userId;
    private Long amount;
    private String paymentProvider;
    private String redirectUrl;
}
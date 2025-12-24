package com.elearning.paymentservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfirmPaymentRequest {
    private UUID orderId;
    private String partnerCode;
    private String orderInfo;
    private String orderType;
    private String resultCode;
    private String message;
    private String payType;
    private String responseTime;
    private String signature;
}
package com.elearning.paymentservice.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class PaymentData {
    private String redirectUrl;
    private String qrCodeContent;
    private Map<String, Object> sdkParameters;
}

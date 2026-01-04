package com.elearning.paymentservice.strategy.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GatewayCreationResponse {
    private String paymentUrl;
    private String providerTransactionId;
    private String qrCodeContent;
}

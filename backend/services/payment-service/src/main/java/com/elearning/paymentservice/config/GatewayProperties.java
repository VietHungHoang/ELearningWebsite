package com.elearning.paymentservice.config;

import lombok.Data;

/**
 * Properties for a payment gateway provider.
 */
@Data
public class GatewayProperties {
    private String partnerCode;
    private String accessKey;
    private String secretKey;
    private String endpoint;
}
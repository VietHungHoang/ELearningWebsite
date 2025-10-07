package com.elearning.paymentservice.strategy.dto;

import lombok.Data;

import java.util.Map;

@Data
public class WebhookPayload {
    private String provider;
    private Map<String, Object> rawPayload;
}

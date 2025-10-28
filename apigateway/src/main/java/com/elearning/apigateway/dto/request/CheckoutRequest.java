package com.elearning.apigateway.dto.request;

import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for checkout request
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequest {

    private String paymentMethod; // CARD, BANK_TRANSFER, etc.
    private String couponCode; // Apply coupon for entire cart
    private Map<String, Object> metadata; // Additional info
}

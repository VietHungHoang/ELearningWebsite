package com.elearning.cart_service.client;

import com.elearning.cart_service.config.CartServiceConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * Gọi API Coupon Service
 */
@Component
@RequiredArgsConstructor
public class CouponClient {

    private final RestTemplate restTemplate;
    private final CartServiceConfig config;

    /**
     * Validate coupon cho 1 course
     */
    public CouponValidationResponse validateCoupon(Long courseId, String couponCode, Long learnerId) {
        String url = String.format("%s/validate?courseId=%d&couponCode=%s&learnerId=%d",
                config.getCouponUrl(), courseId, couponCode, learnerId);

        return restTemplate.getForObject(url, CouponValidationResponse.class);
    }

    // ========== DTO nội bộ ==========

    @lombok.Data
    public static class CouponValidationResponse {
        private boolean valid;
        private Double discountAmount;
        private String message;
    }
}

package com.elearning.cart_service.client;

import com.elearning.cart_service.config.CartServiceConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class CouponClient {

    private final RestTemplate restTemplate;
    private final CartServiceConfig config;

    public CouponValidationResponse validateCoupon(Long courseId, String couponCode, Long learnerId) {
        String url = String.format("%s/validate?courseId=%d&couponCode=%s&learnerId=%d",
                config.getCouponUrl(), courseId, couponCode, learnerId);

        return restTemplate.getForObject(url, CouponValidationResponse.class);
    }

    @lombok.Data
    public static class CouponValidationResponse {
        private boolean valid;
        private Double discountAmount;
        private String message;
    }
}

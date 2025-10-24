package com.elearning.learner_bff_service.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class CartServiceClient {

    private final RestTemplate restTemplate;

    @Value("${services.cart.base-url:http://localhost:8000/api/v1/cart}")
    private String baseUrl;

    @Cacheable(value = "carts", key = "#accountId")
    public Map<String, Object> getCart(Long accountId) {
        try {
            String url = baseUrl + "/" + accountId;
            return restTemplate.getForObject(url, Map.class);
        } catch (RestClientException e) {
            log.error("Error getting cart for accountId: {}", accountId, e);
            return Map.of("items", java.util.List.of(), "totalPrice", 0.0);
        }
    }

    public Map<String, Object> addItem(Long accountId, Long courseId) {
        try {
            String url = baseUrl + "/" + accountId + "/items/" + courseId;
            return restTemplate.postForObject(url, null, Map.class);
        } catch (RestClientException e) {
            log.error("Error adding item to cart for accountId: {}, courseId: {}", accountId, courseId, e);
            return Map.of("success", false);
        }
    }

    public Map<String, Object> removeItem(Long accountId, Long courseId) {
        try {
            String url = baseUrl + "/" + accountId + "/items/" + courseId;
            restTemplate.delete(url);
            return Map.of("success", true);
        } catch (RestClientException e) {
            log.error("Error removing item from cart for accountId: {}, courseId: {}", accountId, courseId, e);
            return Map.of("success", false);
        }
    }

    public Integer getCartItemCount(Long accountId) {
        try {
            var cart = getCart(accountId);
            if (cart != null && cart.containsKey("itemCount")) {
                Object count = cart.get("itemCount");
                if (count instanceof Number) {
                    return ((Number) count).intValue();
                }
            }
            return 0;
        } catch (Exception e) {
            log.error("Error getting cart item count for accountId: {}", accountId, e);
            return 0;
        }
    }

    public Map<String, Object> applyCoupon(Long accountId, Long courseId, Map<String, Object> coupon) {
        try {
            String url = baseUrl + "/" + accountId + "/items/" + courseId + "/apply-coupon";
            return restTemplate.postForObject(url, coupon, Map.class);
        } catch (RestClientException e) {
            log.error("Error applying coupon for accountId: {}, courseId: {}", accountId, courseId, e);
            return Map.of("success", false);
        }
    }
}

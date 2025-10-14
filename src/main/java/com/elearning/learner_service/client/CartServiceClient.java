package com.elearning.learner_service.client;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class CartServiceClient {

    private final RestTemplate restTemplate;
    private final String baseUrl = "http://api-gateway/api/v1/cart";

    public Map<String, Object> getCart(Long accountId) {
        String url = baseUrl + "/" + accountId;
        return restTemplate.getForObject(url, Map.class);
    }

    public Map<String, Object> addItem(Long accountId, Long courseId) {
        String url = baseUrl + "/" + accountId + "/items/" + courseId;
        return restTemplate.postForObject(url, null, Map.class);
    }

    public Map<String, Object> removeItem(Long accountId, Long courseId) {
        String url = baseUrl + "/" + accountId + "/items/" + courseId;
        restTemplate.delete(url);
        return Map.of("message", "Item removed");
    }

    public Map<String, Object> applyCoupon(Long accountId, Long courseId, Map<String, Object> coupon) {
        String url = baseUrl + "/" + accountId + "/items/" + courseId + "/apply-coupon";
        return restTemplate.postForObject(url, coupon, Map.class);
    }
}

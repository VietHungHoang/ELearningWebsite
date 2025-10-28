package com.elearning.apigateway.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.elearning.apigateway.dto.request.WishlistRequest;
import com.elearning.apigateway.dto.response.WishlistResponse;

import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class WishlistClient {

    private final RestTemplate restTemplate;

    @Value("${services.learner-service.url}")
    private String baseUrl;

    public WishlistResponse addToWishlist(WishlistRequest request) {
        try {
            String url = baseUrl + "/learners/wishlist";
            return restTemplate.postForObject(url, request, WishlistResponse.class);
        } catch (Exception e) {
            log.error("Error adding to wishlist", e);
            throw e;
        }
    }

    public List<WishlistResponse> getWishlist(Long accountId) {
        try {
            String url = baseUrl + "/learners/wishlist/" + accountId;
            var response = restTemplate.exchange(url, HttpMethod.GET, null,
                    new ParameterizedTypeReference<Map<String, List<WishlistResponse>>>() {
                    });

            if (response.getBody() != null) {
                Map<String, List<WishlistResponse>> body = response.getBody();
                if (body != null && body.containsKey("data")) {
                    return body.get("data");
                }
            }
            return List.of();
        } catch (Exception e) {
            log.error("Error getting wishlist for accountId: {}", accountId, e);
            return List.of();
        }
    }

    public void removeFromWishlist(Long accountId, Long courseId) {
        try {
            String url = baseUrl + "/learners/wishlist/" + accountId + "/" + courseId;
            restTemplate.delete(url);
        } catch (Exception e) {
            log.error("Error removing from wishlist for accountId: {}, courseId: {}", accountId, courseId, e);
            throw e;
        }
    }
}


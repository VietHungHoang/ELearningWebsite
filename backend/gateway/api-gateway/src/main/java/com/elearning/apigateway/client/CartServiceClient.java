package com.elearning.apigateway.client;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import com.elearning.apigateway.dto.request.AddToCartRequest;
import com.elearning.apigateway.dto.request.CheckoutRequest;
import com.elearning.apigateway.dto.response.ApiResponse;
import com.elearning.apigateway.dto.response.CartResponse;
import com.elearning.apigateway.dto.response.CheckoutResponse;

@Slf4j
@Component
@RequiredArgsConstructor
public class CartServiceClient {

    private final RestTemplate restTemplate;

    @Value("${services.cart-service.url}")
    private String cartServiceBaseUrl;

    public CartResponse getCart(Long learnerId) {
        try {
            String url = cartServiceBaseUrl + "/api/learners/" + learnerId + "/cart";
            log.info("Fetching cart from: {}", url);
            ApiResponse<CartResponse> apiResponse = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<ApiResponse<CartResponse>>() {
                    }).getBody();
            return apiResponse != null ? apiResponse.getData() : null;
        } catch (Exception e) {
            log.error("Error fetching cart for learner: {}", learnerId, e);
            throw new RuntimeException("Failed to fetch cart", e);
        }
    }

    public CartResponse addToCart(Long learnerId, AddToCartRequest request) {
        try {
            String url = cartServiceBaseUrl + "/api/learners/" + learnerId + "/cart/items";
            log.info("Adding item to cart: {}", url);
            ApiResponse<CartResponse> apiResponse = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    new HttpEntity<>(request),
                    new ParameterizedTypeReference<ApiResponse<CartResponse>>() {
                    }).getBody();
            return apiResponse != null ? apiResponse.getData() : null;
        } catch (Exception e) {
            log.error("Error adding item to cart for learner: {}", learnerId, e);
            throw new RuntimeException("Failed to add item to cart", e);
        }
    }

    public CartResponse removeItem(Long learnerId, Long courseId) {
        try {
            String url = cartServiceBaseUrl + "/api/learners/" + learnerId + "/cart/items/" + courseId;
            log.info("Removing item from cart: {}", url);
            restTemplate.delete(url);
            return getCart(learnerId);
        } catch (Exception e) {
            log.error("Error removing item from cart for learner: {}", learnerId, e);
            throw new RuntimeException("Failed to remove item from cart", e);
        }
    }

    public CheckoutResponse checkout(Long learnerId, CheckoutRequest request) {
        try {
            String url = cartServiceBaseUrl + "/api/learners/" + learnerId + "/cart/checkout";
            log.info("Checkout cart: {}", url);
            ApiResponse<CheckoutResponse> apiResponse = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    new HttpEntity<>(request),
                    new ParameterizedTypeReference<ApiResponse<CheckoutResponse>>() {
                    }).getBody();
            return apiResponse != null ? apiResponse.getData() : null;
        } catch (Exception e) {
            log.error("Error during checkout for learner: {}", learnerId, e);
            return CheckoutResponse.builder()
                    .status("FAILED")
                    .message("Checkout failed: " + e.getMessage())
                    .build();
        }
    }

    public CartResponse applyCoupon(Long learnerId, Long courseId, String couponCode) {
        try {
            String url = cartServiceBaseUrl + "/api/learners/" + learnerId + "/cart/items/" + courseId
                    + "/apply-coupon";
            Map<String, String> couponRequest = Map.of("couponCode", couponCode);
            log.info("Applying coupon: {}", url);
            ApiResponse<CartResponse> apiResponse = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    new HttpEntity<>(couponRequest),
                    new ParameterizedTypeReference<ApiResponse<CartResponse>>() {
                    }).getBody();
            return apiResponse != null ? apiResponse.getData() : null;
        } catch (Exception e) {
            log.error("Error applying coupon for learner: {}", learnerId, e);
            throw new RuntimeException("Failed to apply coupon", e);
        }
    }

    public void clearCart(Long learnerId) {
        try {
            String url = cartServiceBaseUrl + "/api/learners/" + learnerId + "/cart/clear";
            log.info("Clearing cart: {}", url);
            restTemplate.delete(url);
        } catch (Exception e) {
            log.error("Error clearing cart for learner: {}", learnerId, e);
        }
    }
}

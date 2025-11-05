package com.elearning.bffservice.client;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import com.elearning.bffservice.dto.request.AddToCartRequest;
import com.elearning.bffservice.dto.response.ApiResponse;
import com.elearning.bffservice.dto.response.CartResponse;

@Component
@RequiredArgsConstructor
public class CartServiceClient {
    private final RestTemplate restTemplate;
    @Value("${services.cart-service.url}")
    private String cartServiceBaseUrl;

    public CartResponse getCart(String learnerId) {
        try {
            String url = cartServiceBaseUrl + "/api/learners/" + learnerId + "/cart";
            ApiResponse<CartResponse> apiResponse = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<ApiResponse<CartResponse>>() {
                    }).getBody();
            return apiResponse != null ? apiResponse.getData() : null;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch cart", e);
        }
    }

    public CartResponse addToCart(String learnerId, AddToCartRequest request) {
        try {
            String url = cartServiceBaseUrl + "/api/learners/" + learnerId + "/cart/items";

            HttpHeaders headers = new HttpHeaders();
            headers.set("X-Learner-Id", learnerId);

            ApiResponse<CartResponse> apiResponse = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    new HttpEntity<>(request, headers),
                    new ParameterizedTypeReference<ApiResponse<CartResponse>>() {
                    }).getBody();
            return apiResponse != null ? apiResponse.getData() : null;
        } catch (Exception e) {
            throw new RuntimeException("Failed to add item to cart", e);
        }
    }

    public CartResponse removeItem(String learnerId, Long courseId) {
        try {
            String url = cartServiceBaseUrl + "/api/learners/" + learnerId + "/cart/items/" + courseId;
            restTemplate.delete(url);
            return getCart(learnerId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to remove item from cart", e);
        }
    }

    public CartResponse applyCoupon(String learnerId, Long courseId, String couponCode) {
        try {
            String url = cartServiceBaseUrl + "/api/learners/" + learnerId + "/cart/items/" + courseId
                    + "/apply-coupon";
            Map<String, String> couponRequest = Map.of("couponCode", couponCode);
            ApiResponse<CartResponse> apiResponse = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    new HttpEntity<>(couponRequest),
                    new ParameterizedTypeReference<ApiResponse<CartResponse>>() {
                    }).getBody();
            return apiResponse != null ? apiResponse.getData() : null;
        } catch (Exception e) {
            throw new RuntimeException("Failed to apply coupon", e);
        }
    }

    public CartResponse checkout(String learnerId) {
        try {
            String url = cartServiceBaseUrl + "/api/learners/" + learnerId + "/checkout";
            ApiResponse<CartResponse> apiResponse = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    null,
                    new ParameterizedTypeReference<ApiResponse<CartResponse>>() {
                    }).getBody();
            return apiResponse != null ? apiResponse.getData() : null;
        } catch (Exception e) {
            throw new RuntimeException("Failed to process checkout", e);
        }
    }

}
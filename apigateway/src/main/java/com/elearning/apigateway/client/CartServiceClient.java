package com.elearning.apigateway.client;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import com.elearning.apigateway.dto.request.AddToCartRequest;
import com.elearning.apigateway.dto.response.CartResponse;
import com.elearning.apigateway.dto.response.CheckoutResponse;

/**
 * Client để call Cart Microservice
 * Gọi các API từ cart-service
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CartServiceClient {

    private final RestTemplate restTemplate;

    @Value("${service.cart.base-url}")
    private String cartServiceBaseUrl;

    /**
     * GET /api/v1/cart/{learnerId}
     * Lấy giỏ hàng của learner
     */
    public CartResponse getCart(Long learnerId) {
        try {
            String url = cartServiceBaseUrl + "/" + learnerId;
            log.info("Fetching cart from: {}", url);
            return restTemplate.getForObject(url, CartResponse.class);
        } catch (Exception e) {
            log.error("Error fetching cart for learner: {}", learnerId, e);
            return CartResponse.builder()
                    .learnerId(learnerId)
                    .status("ERROR")
                    .totalAmount(java.math.BigDecimal.ZERO)
                    .build();
        }
    }

    /**
     * POST /api/v1/cart/{learnerId}/add-item
     * Thêm course vào giỏ hàng
     */
    public CartResponse addToCart(Long learnerId, AddToCartRequest request) {
        try {
            String url = cartServiceBaseUrl + "/" + learnerId + "/add-item";
            log.info("Adding item to cart: {}", url);
            return restTemplate.postForObject(url, request, CartResponse.class);
        } catch (Exception e) {
            log.error("Error adding item to cart for learner: {}", learnerId, e);
            throw new RuntimeException("Failed to add item to cart", e);
        }
    }

    /**
     * DELETE /api/v1/cart/{learnerId}/items/{courseId}
     * Xoá course khỏi giỏ hàng
     */
    public CartResponse removeItem(Long learnerId, Long courseId) {
        try {
            String url = cartServiceBaseUrl + "/" + learnerId + "/items/" + courseId;
            log.info("Removing item from cart: {}", url);
            restTemplate.delete(url);
            return getCart(learnerId);
        } catch (Exception e) {
            log.error("Error removing item from cart for learner: {}", learnerId, e);
            throw new RuntimeException("Failed to remove item from cart", e);
        }
    }

    /**
     * POST /api/v1/cart/{learnerId}/checkout
     * Thực hiện checkout
     */
    public CheckoutResponse checkout(Long learnerId, Map<String, Object> checkoutData) {
        try {
            String url = cartServiceBaseUrl + "/" + learnerId + "/checkout";
            log.info("Checkout cart: {}", url);
            return restTemplate.postForObject(url, checkoutData, CheckoutResponse.class);
        } catch (Exception e) {
            log.error("Error during checkout for learner: {}", learnerId, e);
            return CheckoutResponse.builder()
                    .status("FAILED")
                    .message("Checkout failed: " + e.getMessage())
                    .build();
        }
    }

    /**
     * POST /api/v1/cart/{learnerId}/items/{courseId}/apply-coupon
     * Apply coupon cho item trong cart
     */
    public CartResponse applyCoupon(Long learnerId, Long courseId, String couponCode) {
        try {
            String url = cartServiceBaseUrl + "/" + learnerId + "/items/" + courseId + "/apply-coupon";
            Map<String, String> couponRequest = Map.of("couponCode", couponCode);
            log.info("Applying coupon: {}", url);
            return restTemplate.postForObject(url, couponRequest, CartResponse.class);
        } catch (Exception e) {
            log.error("Error applying coupon for learner: {}", learnerId, e);
            throw new RuntimeException("Failed to apply coupon", e);
        }
    }

    /**
     * GET /api/v1/cart/{learnerId}/clear
     * Xoá toàn bộ giỏ hàng
     */
    public void clearCart(Long learnerId) {
        try {
            String url = cartServiceBaseUrl + "/" + learnerId + "/clear";
            log.info("Clearing cart: {}", url);
            restTemplate.delete(url);
        } catch (Exception e) {
            log.error("Error clearing cart for learner: {}", learnerId, e);
            // Không throw exception, chỉ log warning
        }
    }
}

package com.elearning.apigateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.elearning.apigateway.dto.request.AddToCartRequest;
import com.elearning.apigateway.dto.request.ApplyCouponRequest;
import com.elearning.apigateway.dto.request.CheckoutRequest;
import com.elearning.apigateway.dto.response.ApiResponse;
import com.elearning.apigateway.dto.response.CartResponse;
import com.elearning.apigateway.dto.response.CheckoutResponse;
import com.elearning.apigateway.service.CartService;

/**
 * REST Controller cho Cart
 * Nhận requests từ FE và xử lý qua CartService
 */
@Slf4j
@RestController
@RequestMapping("/api/learners/{learnerId}/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    /**
     * GET /api/learners/{learnerId}/cart
     * Lấy cart hiện tại của learner
     */
    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(@PathVariable Long learnerId) {
        log.info("GET cart for learner: {}", learnerId);
        CartResponse cart = cartService.getCart(learnerId);
        ApiResponse<CartResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Fetch cart successfully.",
                cart);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/learners/{learnerId}/cart/items
     * Add course vào cart
     */
    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            @PathVariable Long learnerId,
            @RequestBody AddToCartRequest request) {
        log.info("POST add to cart for learner: {}, course: {}", learnerId, request.getCourseId());

        CartResponse cart = cartService.addToCart(learnerId, request);
        ApiResponse<CartResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Course added to cart successfully.",
                cart);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/learners/{learnerId}/cart/items/{courseId}
     * Xoá 1 course khỏi cart
     */
    @DeleteMapping("/items/{courseId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(
            @PathVariable Long learnerId,
            @PathVariable Long courseId) {
        log.info("DELETE item from cart for learner: {}, course: {}", learnerId, courseId);

        CartResponse cart = cartService.removeItem(learnerId, courseId);
        ApiResponse<CartResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Item removed successfully.",
                cart);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/learners/{learnerId}/cart/checkout
     * Thực hiện checkout toàn bộ cart
     */
    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<CheckoutResponse>> checkout(
            @PathVariable Long learnerId,
            @RequestBody(required = false) CheckoutRequest request) {
        log.info("POST checkout for learner: {}", learnerId);

        if (request == null) {
            request = new CheckoutRequest(); // tránh null
        }

        // Gọi service
        CheckoutResponse checkoutResult = cartService.checkout(learnerId, request);

        ApiResponse<CheckoutResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Checkout successfully.",
                checkoutResult);

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/learners/{learnerId}/cart/items/{courseId}/apply-coupon
     * Apply coupon cho 1 course trong cart
     */
    @PostMapping("/items/{courseId}/apply-coupon")
    public ResponseEntity<ApiResponse<CartResponse>> applyCoupon(
            @PathVariable Long learnerId,
            @PathVariable Long courseId,
            @RequestBody ApplyCouponRequest request) {
        log.info("POST apply coupon for learner: {}, course: {}, coupon: {}",
                learnerId, courseId, request.getCouponCode());

        request.setCourseId(courseId); // đảm bảo DTO có courseId
        CartResponse cart = cartService.applyCoupon(learnerId, request);

        ApiResponse<CartResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Coupon applied successfully.",
                cart);
        return ResponseEntity.ok(response);
    }
}

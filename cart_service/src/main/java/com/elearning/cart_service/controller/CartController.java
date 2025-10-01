package com.elearning.cart_service.controller;

import com.elearning.cart_service.dto.request.AddToCartRequest;
import com.elearning.cart_service.dto.request.ApplyCouponRequest;
import com.elearning.cart_service.dto.request.CheckoutRequest;
import com.elearning.cart_service.dto.response.ApiResponse;
import com.elearning.cart_service.dto.response.CartResponse;
import com.elearning.cart_service.dto.response.CheckoutResponse;
import com.elearning.cart_service.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller cho Cart
 */
@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    /**
     * POST /api/carts/{learnerId}/items
     * Add course vào cart
     */
    @PostMapping("/{learnerId}/items")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            @PathVariable Long learnerId,
            @RequestBody AddToCartRequest request) {

        CartResponse cart = cartService.addToCart(learnerId, request);
        ApiResponse<CartResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Course added to cart successfully.",
                cart);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/carts/{learnerId}
     * Lấy cart hiện tại của learner
     */
    @GetMapping("/{learnerId}")
    public ResponseEntity<ApiResponse<CartResponse>> getCart(@PathVariable Long learnerId) {
        CartResponse cart = cartService.getCart(learnerId);
        ApiResponse<CartResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Fetch cart successfully.",
                cart);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/carts/{learnerId}/items/{courseId}
     * Xoá 1 course khỏi cart
     */
    @DeleteMapping("/{learnerId}/items/{courseId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(
            @PathVariable Long learnerId,
            @PathVariable Long courseId) {

        CartResponse cart = cartService.removeItem(learnerId, courseId);
        ApiResponse<CartResponse> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Item removed successfully.",
                cart);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/carts/{learnerId}/checkout
     * Thực hiện checkout toàn bộ cart
     */
    @PostMapping("/{learnerId}/checkout")
    public ResponseEntity<ApiResponse<CheckoutResponse>> checkout(
            @PathVariable Long learnerId,
            @RequestBody(required = false) CheckoutRequest request) {

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
    //Apply coupon
    @PostMapping("/{learnerId}/items/{courseId}/apply-coupon")
public ResponseEntity<ApiResponse<CartResponse>> applyCoupon(
        @PathVariable Long learnerId,
        @PathVariable Long courseId,
        @RequestBody ApplyCouponRequest request) {

    request.setCourseId(courseId); // đảm bảo DTO có courseId
    CartResponse cart = cartService.applyCoupon(learnerId, request);

    ApiResponse<CartResponse> response = new ApiResponse<>(
            HttpStatus.OK.value(),
            "Coupon applied successfully.",
            cart
    );
    return ResponseEntity.ok(response);
}

}

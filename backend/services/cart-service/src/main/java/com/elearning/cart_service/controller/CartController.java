package com.elearning.cart_service.controller;

import com.elearning.cart_service.dto.request.AddToCartRequest;
import com.elearning.cart_service.dto.request.ApplyCouponRequest;
import com.elearning.cart_service.dto.request.CheckoutRequest;
import com.elearning.cart_service.dto.response.ApiResponse;
import com.elearning.cart_service.dto.response.CartResponse;
import com.elearning.cart_service.dto.response.CheckoutResponse;
import com.elearning.cart_service.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/learners/{learnerId}/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(@PathVariable String learnerId) {
        CartResponse cart = cartService.getCart(learnerId);
        ApiResponse<CartResponse> response = ApiResponse.success(cart, "Fetch cart successfully.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            @PathVariable String learnerId,
            @RequestBody AddToCartRequest request) {

        CartResponse cart = cartService.addToCart(learnerId, request);
        ApiResponse<CartResponse> response = ApiResponse.success(cart, "Course added to cart successfully.");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/items/{courseId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(
            @PathVariable String learnerId,
            @PathVariable Long courseId) {

        CartResponse cart = cartService.removeItem(learnerId, courseId);
        ApiResponse<CartResponse> response = ApiResponse.success(cart, "Item removed successfully.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<CheckoutResponse>> checkout(
            @PathVariable String learnerId,
            @RequestBody(required = false) CheckoutRequest request) {

        if (request == null) {
            request = new CheckoutRequest();
        }

        CheckoutResponse checkoutResult = cartService.checkout(learnerId, request);

        ApiResponse<CheckoutResponse> response = ApiResponse.success(checkoutResult, "Checkout successfully.");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/items/{courseId}/apply-coupon")
    public ResponseEntity<ApiResponse<CartResponse>> applyCoupon(
            @PathVariable String learnerId,
            @PathVariable Long courseId,
            @RequestBody ApplyCouponRequest request) {

        request.setCourseId(courseId);
        CartResponse cart = cartService.applyCoupon(learnerId, request);

        ApiResponse<CartResponse> response = ApiResponse.success(cart, "Coupon applied successfully.");
        return ResponseEntity.ok(response);
    }

}
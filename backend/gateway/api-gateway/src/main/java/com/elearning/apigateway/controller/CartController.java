package com.elearning.apigateway.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import com.elearning.apigateway.bff.response.AddToCartBFFResponse;
import com.elearning.apigateway.dto.request.AddToCartRequest;
import com.elearning.apigateway.dto.response.ApiResponse;
import com.elearning.apigateway.bff.response.ApplyCouponBFFResponse;
import com.elearning.apigateway.dto.request.ApplyCouponRequest;
import com.elearning.apigateway.bff.response.CheckoutBFFResponse;
import com.elearning.apigateway.dto.request.CheckoutRequest;
import com.elearning.apigateway.bff.response.RemoveFromCartBFFResponse;
import com.elearning.apigateway.bff.response.ViewCartBFFResponse;
import com.elearning.apigateway.service.CartService;
@RestController
@RequestMapping("/api/learners/{learnerId}/cart")
@RequiredArgsConstructor
public class CartController {
        private final CartService cartService;

        @PostMapping("/items")
        public ResponseEntity<ApiResponse<AddToCartBFFResponse>> addToCart(
                        @PathVariable String learnerId,
                        @RequestBody AddToCartRequest request) {
                String effectiveLearnerId = (learnerId == null || learnerId.trim().isEmpty()) ? "1" : learnerId;
                try {
                        if (request.getCourseId() == null || request.getCourseId() <= 0) {
                                ApiResponse<AddToCartBFFResponse> errorResponse = ApiResponse.error(400,
                                                "Invalid courseId");
                                return ResponseEntity.badRequest().body(errorResponse);
                        }
                        AddToCartBFFResponse bffResponse = cartService.addToCart(effectiveLearnerId, request);
                        ApiResponse<AddToCartBFFResponse> response = ApiResponse.success(bffResponse,
                                        "Item added to cart successfully");
                        return ResponseEntity.ok(response);

                } catch (IllegalArgumentException e) {
                        ApiResponse<AddToCartBFFResponse> errorResponse = ApiResponse.error(409, e.getMessage());
                        return ResponseEntity.status(409).body(errorResponse);
                } catch (Exception e) {
                        ApiResponse<AddToCartBFFResponse> errorResponse = ApiResponse.error(500,
                                        "Failed to add item: " + e.getMessage());
                        return ResponseEntity.status(500).body(errorResponse);
                }
        }

        @GetMapping
        public ResponseEntity<ApiResponse<ViewCartBFFResponse>> getCart(
                        @PathVariable String learnerId) {
                String effectiveLearnerId = (learnerId == null || learnerId.trim().isEmpty()) ? "1" : learnerId;
                try {
                        ViewCartBFFResponse cartResponse = cartService.getCart(effectiveLearnerId);
                        ApiResponse<ViewCartBFFResponse> response = ApiResponse.success(cartResponse,
                                        "Cart retrieved successfully");
                        return ResponseEntity.ok(response);
                } catch (Exception e) {
                        ApiResponse<ViewCartBFFResponse> errorResponse = ApiResponse.error(500,
                                        "Failed to get cart: " + e.getMessage());
                        return ResponseEntity.status(500).body(errorResponse);
                }
        }
        @DeleteMapping("/items/{courseId}")
        public ResponseEntity<ApiResponse<RemoveFromCartBFFResponse>> removeItem(
                        @PathVariable String learnerId,
                        @PathVariable Long courseId) {
                String effectiveLearnerId = (learnerId == null || learnerId.trim().isEmpty()) ? "1" : learnerId;
                try {
                        if (courseId == null || courseId <= 0) {
                                ApiResponse<RemoveFromCartBFFResponse> errorResponse = ApiResponse.error(400,
                                                "Invalid courseId");
                                return ResponseEntity.badRequest().body(errorResponse);
                        }
                        RemoveFromCartBFFResponse bffResponse = cartService.removeItem(effectiveLearnerId,
                                        courseId);
                        ApiResponse<RemoveFromCartBFFResponse> response = ApiResponse.success(bffResponse,
                                        "Item removed from cart successfully");
                        return ResponseEntity.ok(response);
                } catch (Exception e) {
                        ApiResponse<RemoveFromCartBFFResponse> errorResponse = ApiResponse.error(500,
                                        "Failed to remove item: " + e.getMessage());
                        return ResponseEntity.status(500).body(errorResponse);
                }
        }

        @PostMapping("/apply-coupon")
        public ResponseEntity<ApiResponse<ApplyCouponBFFResponse>> applyCoupon(
                        @PathVariable String learnerId,
                        @RequestBody ApplyCouponRequest request) {
                String effectiveLearnerId = (learnerId == null || learnerId.trim().isEmpty()) ? "1" : learnerId;
                try {
                        if (request.getCouponCode() == null || request.getCouponCode().trim().isEmpty()) {
                                ApiResponse<ApplyCouponBFFResponse> errorResponse = ApiResponse.error(400,
                                                "Invalid couponCode");
                                return ResponseEntity.badRequest().body(errorResponse);
                        }
                        ApplyCouponBFFResponse bffResponse = cartService.applyCoupon(effectiveLearnerId, request);
                        ApiResponse<ApplyCouponBFFResponse> response = ApiResponse.success(bffResponse,
                                        "Coupon applied successfully");
                        return ResponseEntity.ok(response);
                } catch (Exception e) {
                        ApiResponse<ApplyCouponBFFResponse> errorResponse = ApiResponse.error(500,
                                        "Failed to apply coupon: " + e.getMessage());
                        return ResponseEntity.status(500).body(errorResponse);
                }
        }

        @PostMapping("/checkout")
        public ResponseEntity<ApiResponse<CheckoutBFFResponse>> checkout(
                        @PathVariable String learnerId,
                        @RequestBody CheckoutRequest request) {
                String effectiveLearnerId = (learnerId == null || learnerId.trim().isEmpty()) ? "1" : learnerId;
                try {
                        CheckoutBFFResponse bffResponse = cartService.checkout(effectiveLearnerId, request);
                        ApiResponse<CheckoutBFFResponse> response = ApiResponse.success(bffResponse,
                                        "Checkout processed successfully");
                        return ResponseEntity.ok(response);
                } catch (Exception e) {
                        ApiResponse<CheckoutBFFResponse> errorResponse = ApiResponse.error(500,
                                        "Failed to checkout: " + e.getMessage());
                        return ResponseEntity.status(500).body(errorResponse);
                }
        }
}

package com.elearning.apigateway.service;

import com.elearning.apigateway.dto.request.AddToCartRequest;
import com.elearning.apigateway.dto.request.ApplyCouponRequest;
import com.elearning.apigateway.dto.request.CheckoutRequest;
import com.elearning.apigateway.dto.response.CartResponse;
import com.elearning.apigateway.dto.response.CheckoutResponse;

/**
 * Service interface for cart operations
 * Tổng hợp dữ liệu từ cart service + course service
 */
public interface CartService {

    /**
     * Lấy giỏ hàng của learner
     */
    CartResponse getCart(Long learnerId);

    /**
     * Thêm course vào giỏ hàng
     */
    CartResponse addToCart(Long learnerId, AddToCartRequest request);

    /**
     * Xoá course khỏi giỏ hàng
     */
    CartResponse removeItem(Long learnerId, Long courseId);

    /**
     * Thực hiện checkout
     */
    CheckoutResponse checkout(Long learnerId, CheckoutRequest request);

    /**
     * Apply coupon cho item trong cart
     */
    CartResponse applyCoupon(Long learnerId, ApplyCouponRequest request);

    /**
     * Xoá toàn bộ giỏ hàng
     */
    void clearCart(Long learnerId);
}

package com.elearning.cart_service.service;

import com.elearning.cart_service.dto.request.AddToCartRequest;
import com.elearning.cart_service.dto.request.CheckoutRequest;
import com.elearning.cart_service.dto.request.ApplyCouponRequest;
import com.elearning.cart_service.dto.response.CartResponse;
import com.elearning.cart_service.dto.response.CheckoutResponse;

public interface CartService {

    CartResponse addToCart(Long learnerId, AddToCartRequest request);

    CartResponse getCart(Long learnerId);

    CartResponse removeItem(Long learnerId, Long courseId);

    CheckoutResponse checkout(Long learnerId, CheckoutRequest request);

    // Apply coupon cho 1 course trong cart
    CartResponse applyCoupon(Long learnerId, ApplyCouponRequest request);
}

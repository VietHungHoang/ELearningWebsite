package com.elearning.cart_service.service;

import com.elearning.cart_service.dto.request.AddToCartRequest;
import com.elearning.cart_service.dto.request.CheckoutRequest;
import com.elearning.cart_service.dto.request.ApplyCouponRequest;
import com.elearning.cart_service.dto.response.CartResponse;
import com.elearning.cart_service.dto.response.CheckoutResponse;

public interface CartService {

    CartResponse addToCart(String learnerId, AddToCartRequest request);

    CartResponse getCart(String learnerId);

    CartResponse removeItem(String learnerId, Long courseId);

    CheckoutResponse checkout(String learnerId, CheckoutRequest request);

    CartResponse applyCoupon(String learnerId, ApplyCouponRequest request);
}

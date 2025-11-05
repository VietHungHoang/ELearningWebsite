package com.elearning.bffservice.service;

import com.elearning.bffservice.bff.response.AddToCartBFFResponse;
import com.elearning.bffservice.bff.response.ApplyCouponBFFResponse;
import com.elearning.bffservice.bff.response.CheckoutBFFResponse;
import com.elearning.bffservice.bff.response.RemoveFromCartBFFResponse;
import com.elearning.bffservice.bff.response.ViewCartBFFResponse;
import com.elearning.bffservice.dto.request.AddToCartRequest;
import com.elearning.bffservice.dto.request.ApplyCouponRequest;
import com.elearning.bffservice.dto.request.CheckoutRequest;

public interface CartService {

    AddToCartBFFResponse addToCart(String learnerId, AddToCartRequest request);

    ViewCartBFFResponse getCart(String learnerId);

    RemoveFromCartBFFResponse removeItem(String learnerId, Long courseId);

    CheckoutBFFResponse checkout(String learnerId, CheckoutRequest request);

    ApplyCouponBFFResponse applyCoupon(String learnerId, ApplyCouponRequest request);
}

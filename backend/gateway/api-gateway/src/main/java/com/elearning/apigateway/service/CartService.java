package com.elearning.apigateway.service;

import com.elearning.apigateway.bff.response.AddToCartBFFResponse;
import com.elearning.apigateway.bff.response.ApplyCouponBFFResponse;
import com.elearning.apigateway.bff.response.CheckoutBFFResponse;
import com.elearning.apigateway.bff.response.RemoveFromCartBFFResponse;
import com.elearning.apigateway.bff.response.ViewCartBFFResponse;
import com.elearning.apigateway.dto.request.AddToCartRequest;
import com.elearning.apigateway.dto.request.ApplyCouponRequest;
import com.elearning.apigateway.dto.request.CheckoutRequest;

public interface CartService {

    AddToCartBFFResponse addToCart(String learnerId, AddToCartRequest request);

    ViewCartBFFResponse getCart(String learnerId);

    RemoveFromCartBFFResponse removeItem(String learnerId, Long courseId);

    CheckoutBFFResponse checkout(String learnerId, CheckoutRequest request);

    ApplyCouponBFFResponse applyCoupon(String learnerId, ApplyCouponRequest request);
}

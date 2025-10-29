package com.elearning.apigateway.service;

import com.elearning.apigateway.dto.request.AddToCartRequest;
import com.elearning.apigateway.dto.request.ApplyCouponRequest;
import com.elearning.apigateway.dto.request.CheckoutRequest;
import com.elearning.apigateway.dto.response.CartResponse;
import com.elearning.apigateway.dto.response.CheckoutResponse;

public interface CartService {


    CartResponse getCart(Long learnerId);

    CartResponse addToCart(Long learnerId, AddToCartRequest request);


    CartResponse removeItem(Long learnerId, Long courseId);

   
    CheckoutResponse checkout(Long learnerId, CheckoutRequest request);

 
    CartResponse applyCoupon(Long learnerId, ApplyCouponRequest request);

  
    void clearCart(Long learnerId);
}

package com.elearning.apigateway.service.impl;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.elearning.apigateway.client.CartServiceClient;
import com.elearning.apigateway.dto.request.AddToCartRequest;
import com.elearning.apigateway.dto.request.ApplyCouponRequest;
import com.elearning.apigateway.dto.request.CheckoutRequest;
import com.elearning.apigateway.dto.response.CartResponse;
import com.elearning.apigateway.dto.response.CheckoutResponse;
import com.elearning.apigateway.service.CartService;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartServiceClient cartServiceClient;

    @Override
    public CartResponse getCart(Long learnerId) {
        log.info("Getting cart for learner: {}", learnerId);
        CartResponse cart = cartServiceClient.getCart(learnerId);

        if (cart == null) {
            cart = CartResponse.builder()
                    .learnerId(learnerId)
                    .status("EMPTY")
                    .totalAmount(java.math.BigDecimal.ZERO)
                    .build();
        }

        return cart;
    }

    @Override
    public CartResponse addToCart(Long learnerId, AddToCartRequest request) {
        log.info("Adding to cart for learner: {}, course: {}", learnerId, request.getCourseId());
        CartResponse updatedCart = cartServiceClient.addToCart(learnerId, request);
        return updatedCart;
    }

    @Override
    public CartResponse removeItem(Long learnerId, Long courseId) {
        log.info("Removing item from cart for learner: {}, course: {}", learnerId, courseId);

        CartResponse updatedCart = cartServiceClient.removeItem(learnerId, courseId);

        return updatedCart;
    }

    @Override
    public CheckoutResponse checkout(Long learnerId, CheckoutRequest request) {
        log.info("Checkout initiated for learner: {}", learnerId);

        if (request == null) {
            request = new CheckoutRequest(); 
        }

        CheckoutResponse response = cartServiceClient.checkout(learnerId, request);

        log.info("Checkout response for learner: {}, status: {}", learnerId, response.getStatus());

        return response;
    }

    @Override
    public CartResponse applyCoupon(Long learnerId, ApplyCouponRequest request) {
        log.info("Applying coupon for learner: {}, course: {}, coupon: {}",
                learnerId, request.getCourseId(), request.getCouponCode());

        CartResponse updatedCart = cartServiceClient.applyCoupon(learnerId,
                request.getCourseId(),
                request.getCouponCode());

        return updatedCart;
    }

    @Override
    public void clearCart(Long learnerId) {
        log.info("Clearing cart for learner: {}", learnerId);
        cartServiceClient.clearCart(learnerId);
    }
}

package com.elearning.learner_bff_service.service.impl;

import com.elearning.learner_bff_service.client.CartServiceClient;
import com.elearning.learner_bff_service.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartServiceClient cartServiceClient;

    @Override
    public Map<String, Object> getCart(Long accountId) {
        log.info("BFF Service: Getting cart for accountId: {}", accountId);
        return cartServiceClient.getCart(accountId);
    }

    @Override
    public Map<String, Object> addItem(Long accountId, Long courseId) {
        log.info("BFF Service: Adding item to cart for accountId: {}, courseId: {}", accountId, courseId);
        return cartServiceClient.addItem(accountId, courseId);
    }

    @Override
    public Map<String, Object> removeItem(Long accountId, Long courseId) {
        log.info("BFF Service: Removing item from cart for accountId: {}, courseId: {}", accountId, courseId);
        return cartServiceClient.removeItem(accountId, courseId);
    }

    @Override
    public Map<String, Object> applyCoupon(Long accountId, Long courseId, Map<String, Object> coupon) {
        log.info("BFF Service: Applying coupon for accountId: {}, courseId: {}", accountId, courseId);
        return cartServiceClient.applyCoupon(accountId, courseId, coupon);
    }
}

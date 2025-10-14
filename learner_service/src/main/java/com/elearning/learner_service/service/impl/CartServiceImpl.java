package com.elearning.learner_service.service.impl;

import com.elearning.learner_service.client.CartServiceClient;
import com.elearning.learner_service.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartServiceClient cartServiceClient;

    @Override
    public Map<String, Object> getCart(Long accountId) {
        return cartServiceClient.getCart(accountId);
    }

    @Override
    public Map<String, Object> addItem(Long accountId, Long courseId) {
        return cartServiceClient.addItem(accountId, courseId);
    }

    @Override
    public Map<String, Object> removeItem(Long accountId, Long courseId) {
        return cartServiceClient.removeItem(accountId, courseId);
    }

    @Override
    public Map<String, Object> applyCoupon(Long accountId, Long courseId, Map<String, Object> coupon) {
        return cartServiceClient.applyCoupon(accountId, courseId, coupon);
    }
}

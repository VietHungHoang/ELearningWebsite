package com.elearning.learner_service.service;

import java.util.Map;

public interface CartService {
    Map<String, Object> getCart(Long accountId);

    Map<String, Object> addItem(Long accountId, Long courseId);

    Map<String, Object> removeItem(Long accountId, Long courseId);

    Map<String, Object> applyCoupon(Long accountId, Long courseId, Map<String, Object> coupon);
}

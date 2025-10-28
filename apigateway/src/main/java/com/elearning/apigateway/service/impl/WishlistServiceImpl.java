package com.elearning.apigateway.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.elearning.apigateway.client.LearnerServiceClient;
import com.elearning.apigateway.dto.request.WishlistRequest;
import com.elearning.apigateway.service.WishlistService;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final LearnerServiceClient learnerServiceClient;

    @Override
    public Map<String, Object> addToWishlist(WishlistRequest request) {
        log.info("BFF Service: Adding to wishlist for accountId: {}, courseId: {}", request.getAccountId(),
                request.getCourseId());
        return learnerServiceClient.addToWishlist(request);
    }

    @Override
    public List<Map<String, Object>> getWishlist(Long accountId) {
        log.info("BFF Service: Getting wishlist for accountId: {}", accountId);
        return learnerServiceClient.getWishlist(accountId);
    }

    @Override
    public void removeFromWishlist(Long accountId, Long courseId) {
        log.info("BFF Service: Removing from wishlist for accountId: {}, courseId: {}", accountId, courseId);
        learnerServiceClient.removeFromWishlist(accountId, courseId);
    }
}


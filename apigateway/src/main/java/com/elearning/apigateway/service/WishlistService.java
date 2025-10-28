package com.elearning.apigateway.service;

import java.util.List;
import java.util.Map;

import com.elearning.apigateway.dto.request.WishlistRequest;

public interface WishlistService {
    Map<String, Object> addToWishlist(WishlistRequest request);

    List<Map<String, Object>> getWishlist(Long accountId);

    void removeFromWishlist(Long accountId, Long courseId);
}


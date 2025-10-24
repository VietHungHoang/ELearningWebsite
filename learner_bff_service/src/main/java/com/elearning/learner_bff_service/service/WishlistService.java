package com.elearning.learner_bff_service.service;

import com.elearning.learner_bff_service.dto.request.WishlistRequest;
import java.util.List;
import java.util.Map;

public interface WishlistService {
    Map<String, Object> addToWishlist(WishlistRequest request);

    List<Map<String, Object>> getWishlist(Long accountId);

    void removeFromWishlist(Long accountId, Long courseId);
}

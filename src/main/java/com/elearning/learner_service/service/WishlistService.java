package com.elearning.learner_service.service;

import com.elearning.learner_service.dto.request.WishlistRequest;
import com.elearning.learner_service.dto.response.WishlistResponse;

import java.util.List;

public interface WishlistService {

    WishlistResponse addToWishlist(WishlistRequest request);

    List<WishlistResponse> getWishlist(Long accountId);

    void removeFromWishlist(Long accountId, Long courseId);

    void removeByCourseId(Long courseId); // xóa khi học viên mua khóa học
}

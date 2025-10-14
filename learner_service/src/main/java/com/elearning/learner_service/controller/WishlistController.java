package com.elearning.learner_service.controller;

import com.elearning.learner_service.dto.request.WishlistRequest;
import com.elearning.learner_service.dto.response.ApiResponse;
import com.elearning.learner_service.dto.response.WishlistResponse;
import com.elearning.learner_service.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/learners/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping
    public ApiResponse<WishlistResponse> addToWishlist(@RequestBody WishlistRequest request) {
        WishlistResponse response = wishlistService.addToWishlist(request);
        return ApiResponse.success(response, "Thêm vào wishlist thành công");
    }

    @GetMapping("/{accountId}")
    public ApiResponse<List<WishlistResponse>> getWishlist(@PathVariable Long accountId) {
        List<WishlistResponse> list = wishlistService.getWishlist(accountId);
        return ApiResponse.success(list, "Lấy danh sách wishlist thành công");
    }

    @DeleteMapping("/{accountId}/{courseId}")
    public ApiResponse<Void> removeFromWishlist(@PathVariable Long accountId,
            @PathVariable Long courseId) {
        wishlistService.removeFromWishlist(accountId, courseId);
        return ApiResponse.success(null, "Xóa khỏi wishlist thành công");
    }
}

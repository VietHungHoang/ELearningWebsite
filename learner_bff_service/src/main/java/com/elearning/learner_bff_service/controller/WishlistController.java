package com.elearning.learner_bff_service.controller;

import com.elearning.learner_bff_service.dto.request.WishlistRequest;
import com.elearning.learner_bff_service.dto.response.ApiResponse;
import com.elearning.learner_bff_service.service.WishlistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/learners/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping
    public ApiResponse<Map<String, Object>> addToWishlist(@RequestBody WishlistRequest request) {
        return ApiResponse.success(wishlistService.addToWishlist(request), "Thêm vào danh sách yêu thích thành công");
    }

    @GetMapping("/{accountId}")
    public ApiResponse<List<Map<String, Object>>> getWishlist(@PathVariable Long accountId) {
        return ApiResponse.success(wishlistService.getWishlist(accountId), "Lấy danh sách yêu thích thành công");
    }

    @DeleteMapping("/{accountId}/{courseId}")
    public ApiResponse<Void> removeFromWishlist(
            @PathVariable Long accountId,
            @PathVariable Long courseId) {
        wishlistService.removeFromWishlist(accountId, courseId);
        return ApiResponse.success(null, "Xóa khỏi danh sách yêu thích thành công");
    }
}

package com.elearning.apigateway.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import com.elearning.apigateway.dto.request.WishlistRequest;
import com.elearning.apigateway.dto.response.ApiResponse;
import com.elearning.apigateway.service.WishlistService;

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


package com.elearning.learner_service.controller;

import com.elearning.learner_service.dto.response.ApiResponse;
import com.elearning.learner_service.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/learners/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/{accountId}")
    public ApiResponse<Map<String, Object>> getCart(@PathVariable Long accountId) {
        return ApiResponse.success(cartService.getCart(accountId), "Lấy giỏ hàng thành công");
    }

    @PostMapping("/{accountId}/items/{courseId}")
    public ApiResponse<Map<String, Object>> addItem(
            @PathVariable Long accountId,
            @PathVariable Long courseId) {
        return ApiResponse.success(cartService.addItem(accountId, courseId), "Thêm khóa học vào giỏ thành công");
    }

    @DeleteMapping("/{accountId}/items/{courseId}")
    public ApiResponse<Map<String, Object>> removeItem(
            @PathVariable Long accountId,
            @PathVariable Long courseId) {
        return ApiResponse.success(cartService.removeItem(accountId, courseId), "Xóa khóa học khỏi giỏ thành công");
    }

    @PostMapping("/{accountId}/items/{courseId}/apply-coupon")
    public ApiResponse<Map<String, Object>> applyCoupon(
            @PathVariable Long accountId,
            @PathVariable Long courseId,
            @RequestBody Map<String, Object> coupon) {
        return ApiResponse.success(cartService.applyCoupon(accountId, courseId, coupon), "Áp dụng coupon thành công");
    }
}

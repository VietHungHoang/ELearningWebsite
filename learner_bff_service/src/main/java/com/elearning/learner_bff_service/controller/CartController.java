package com.elearning.learner_bff_service.controller;

import com.elearning.learner_bff_service.dto.response.ApiResponse;
import com.elearning.learner_bff_service.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
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
        return ApiResponse.success(cartService.addItem(accountId, courseId), "Thêm khóa học vào giỏ hàng thành công");
    }

    @DeleteMapping("/{accountId}/items/{courseId}")
    public ApiResponse<Map<String, Object>> removeItem(
            @PathVariable Long accountId,
            @PathVariable Long courseId) {
        return ApiResponse.success(cartService.removeItem(accountId, courseId),
                "Xóa khóa học khỏi giỏ hàng thành công");
    }

    @PostMapping("/{accountId}/items/{courseId}/apply-coupon")
    public ApiResponse<Map<String, Object>> applyCoupon(
            @PathVariable Long accountId,
            @PathVariable Long courseId,
            @RequestBody Map<String, Object> coupon) {
        return ApiResponse.success(cartService.applyCoupon(accountId, courseId, coupon),
                "Áp dụng mã giảm giá thành công");
    }
}

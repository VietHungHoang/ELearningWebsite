package com.elearning.cart_service.dto.request;

import lombok.Data;

/**
 * DTO cho API apply coupon
 */
@Data
public class ApplyCouponRequest {
    private Long courseId; // ID khóa học muốn áp dụng coupon
    private String couponCode; // Mã coupon do learner nhập
}

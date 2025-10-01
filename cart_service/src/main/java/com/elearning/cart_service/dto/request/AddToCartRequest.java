package com.elearning.cart_service.dto.request;

import lombok.Data;

/**
 * DTO cho API thêm course vào cart
 */
@Data
public class AddToCartRequest {
    private Long courseId;      // ID của khoá học muốn mua
    private String couponCode;  // Mã coupon do user nhập (có thể null)
}

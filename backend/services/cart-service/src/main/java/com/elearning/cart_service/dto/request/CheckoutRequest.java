package com.elearning.cart_service.dto.request;

import lombok.Data;

/**
 * DTO cho API checkout
 */
@Data
public class CheckoutRequest {
    private Long learnerId; // có thể không cần nếu lấy từ token đăng nhập
}
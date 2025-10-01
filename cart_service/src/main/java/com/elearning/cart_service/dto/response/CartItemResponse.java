package com.elearning.cart_service.dto.response;


import lombok.Data;
import java.math.BigDecimal;

/**
 * Thông tin 1 item trong cart trả về cho FE
 */
@Data
public class CartItemResponse {
    private Long id;              // ID của cart item
    private Long courseId;        // ID khoá học
    private String courseTitle;   // Tên khoá học
    private BigDecimal listPrice;     // Giá gốc
    private BigDecimal discountPrice; // Giá sau giảm (nếu có)
    private BigDecimal finalPrice;    // Giá cuối sau coupon
    private String appliedCoupon;     // Coupon đang dùng
    private boolean valid;            // Item còn hợp lệ không
}

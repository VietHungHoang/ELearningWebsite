package com.elearning.cart_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO trả về sau khi checkout thành công
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutResponse {
    private Long orderId; // ID của order vừa tạo
    private BigDecimal totalAmount; // Tổng tiền của đơn hàng
    private String status; // Trạng thái đơn hàng: PENDING / PAID / FAILED
    private String message; // Thông báo cho FE (VD: "Checkout thành công")
}

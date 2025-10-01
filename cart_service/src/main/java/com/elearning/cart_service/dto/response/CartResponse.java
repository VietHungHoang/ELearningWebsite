package com.elearning.cart_service.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Thông tin toàn bộ cart trả về cho FE
 */
@Data
public class CartResponse {
    private Long id; // ID của cart
    private Long learnerId; // ID learner
    private String status; // OPEN / CONVERTED / EXPIRED
    private LocalDateTime expiresAt; // Thời gian hết hạn (để FE đếm ngược)
    private BigDecimal totalAmount; // Tổng tiền của tất cả item
    private List<CartItemResponse> items; // Danh sách item trong cart
}
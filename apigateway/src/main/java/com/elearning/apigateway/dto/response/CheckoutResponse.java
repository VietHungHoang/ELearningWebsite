package com.elearning.apigateway.dto.response;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for checkout response
 * Trả về thông tin đơn hàng sau checkout
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutResponse {

    private Long orderId; // ID của order vừa tạo
    private BigDecimal totalAmount; // Tổng tiền của đơn hàng
    private String status; // PENDING, PAID, FAILED, COMPLETED
    private String message; // Thông báo cho FE
    private String paymentUrl; // URL để redirect FE đến payment gateway (nếu cần)
}

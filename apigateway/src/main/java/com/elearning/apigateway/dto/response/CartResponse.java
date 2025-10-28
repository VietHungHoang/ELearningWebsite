package com.elearning.apigateway.dto.response;

import java.math.BigDecimal;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for cart response
 * Tổng hợp thông tin từ cart service
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {

    private Long id; // ID của cart
    private Long learnerId; // ID learner
    private String status; // OPEN, CONVERTED
    private BigDecimal totalAmount; // Tổng tiền của tất cả item
    private List<CartItemResponse> items; // Danh sách item trong cart
}

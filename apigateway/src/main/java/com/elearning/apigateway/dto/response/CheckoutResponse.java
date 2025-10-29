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

    private Long orderId; 
    private BigDecimal totalAmount; 
    private String status; 
    private String message; 
}

package com.elearning.cart_service.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
@Data
public class CartResponse {
    private Long id;
    private String learnerId;
    private BigDecimal totalAmount;
    private List<CartItemResponse> items;
}
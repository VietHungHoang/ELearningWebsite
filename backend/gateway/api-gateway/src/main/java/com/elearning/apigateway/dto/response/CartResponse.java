package com.elearning.apigateway.dto.response;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;



@Data
public class CartResponse {

    private Long id; 
    private Long learnerId;
    private String status; 
    private BigDecimal totalAmount; 
    private List<CartItemResponse> items; 
}

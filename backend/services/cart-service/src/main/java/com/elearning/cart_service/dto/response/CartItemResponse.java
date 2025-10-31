package com.elearning.cart_service.dto.response;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    private Long id; 
    private Long courseId; 
    private String name; 
    private String category;
    private String tutor;
    private BigDecimal price; 
    private String image;
    private Double rating; 
    private Integer reviews; 
    private String level; 
    private String language;
    private Integer lessons;
    private String duration; 
    private Map<String, Object> availableCoupon; 
}
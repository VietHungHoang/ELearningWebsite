package com.elearning.apigateway.bff.response;

import java.math.BigDecimal;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartPageBFFResponse {

    private Long cartId;
    private Long userId;

    private List<CartItemDetailDTO> items;
    private Integer itemCount;

    private BigDecimal subtotal;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;

    private String appliedCoupon;
    private Integer discountPercentage;
    private List<String> availableCoupons;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemDetailDTO {
        private Long courseId;
        private String courseTitle;
        private String category;
        private String instructorName;
        private Long instructorId;
        private String thumbnailUrl;
        private BigDecimal listPrice;
        private BigDecimal discountPrice;
        private BigDecimal finalPrice;
        private Double rating;
        private Integer students;
        private String appliedCoupon;
        private Boolean valid;
    }
}
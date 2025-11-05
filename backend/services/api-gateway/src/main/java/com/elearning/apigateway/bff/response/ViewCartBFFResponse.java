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
public class ViewCartBFFResponse {
    private Long cartId;
    private String learnerId;

    private List<CartItemBFF> items;
    private BigDecimal subtotal;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private Integer discountPercentage;
    private List<String> availableCoupons;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemBFF {
        private Long id;
        private Long courseId;
        private String courseTitle;
        private String category;
        private String instructorId;
        private String instructorName;
        private BigDecimal price;
        private String image;
        private Double rating;
        private Integer reviews;
        private String level;
        private String language;
        private Integer lessons;
        private String duration;
    }
}

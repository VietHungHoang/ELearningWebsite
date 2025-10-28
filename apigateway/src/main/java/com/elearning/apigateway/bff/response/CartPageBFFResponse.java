package com.elearning.apigateway.bff.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO Cart Page Response - Tổng hợp thông tin cart đầy đủ cho FE
 * Bao gồm:
 * - Danh sách items trong cart
 * - Giá, discount, coupon
 * - Thông tin user
 * - Gợi ý sản phẩm
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartPageBFFResponse {

    private Long cartId;
    private Long userId;

    // =====================
    // Cart Items
    // =====================
    private List<CartItemDetailDTO> items;
    private Integer itemCount;

    // =====================
    // Pricing
    // =====================
    private BigDecimal subtotal; // Tổng tiền trước discount
    private BigDecimal discountAmount; // Tiền giảm
    private BigDecimal totalAmount; // Tổng tiền cuối cùng

    // =====================
    // Coupon
    // =====================
    private String appliedCoupon;
    private Integer discountPercentage;
    private List<String> availableCoupons; // Gợi ý coupons khác

    /**
     * Cart Item Detail
     */
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
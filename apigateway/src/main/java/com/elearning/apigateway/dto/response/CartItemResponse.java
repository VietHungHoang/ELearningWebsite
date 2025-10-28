package com.elearning.apigateway.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    private Long id; // courseId
    private String name; // courseTitle
    private String category;
    private String tutor; // instructorName
    private BigDecimal price; // finalPrice
    private String image; // thumbnailUrl
    private Double rating;
    private Integer reviews; // totalRatings
    // Additional Course Details
    private Long courseId;
    private String instructorName;
    private String instructorAvatar;
    private String description;
    private String level;
    private BigDecimal listPrice;
    private BigDecimal discountPrice;
    private Integer totalStudents;
    private String duration;
    private String language;
    private Integer lessons;
    private Boolean hasCertificate;
    private String lastUpdated;
    private List<String> whatYouWillLearn;
    private List<String> requirements;
    private List<String> includes;

    // Coupon & Pricing
    private Map<String, Object> availableCoupon;
    private String appliedCoupon;
    private Boolean valid; // whether this item is still valid in cart
}

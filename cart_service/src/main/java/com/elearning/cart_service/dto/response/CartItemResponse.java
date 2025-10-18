package com.elearning.cart_service.dto.response;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    private Long id; // cartItemId
    private Long courseId;
    private String courseTitle;
    private String instructorName;
    private String instructorAvatar;
    private String thumbnailUrl;
    private String description;
    private String category;
    private String level;
    private BigDecimal listPrice;
    private BigDecimal discountPrice;
    private BigDecimal finalPrice;
    private Double rating;
    private Integer totalRatings;
    private Integer totalStudents;
    private String duration;
    private String language;
    private Boolean hasCertificate;
    private String lastUpdated;
    private List<String> whatYouWillLearn;
    private List<String> requirements;
    private List<String> includes;
    private String appliedCoupon;
    private Boolean valid;
}
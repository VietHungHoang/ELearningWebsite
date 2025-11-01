package com.elearning.cart_service.dto.request;

import lombok.Data;


@Data
public class ApplyCouponRequest {
    private Long courseId;
    private String couponCode;
}

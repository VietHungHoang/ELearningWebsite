package com.elearning.apigateway.bff.response;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplyCouponBFFResponse {

    private Long cartId;
    private Long courseId;
    private String couponCode;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private Integer itemCount;
}
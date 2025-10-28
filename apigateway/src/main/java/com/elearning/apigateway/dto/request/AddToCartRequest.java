package com.elearning.apigateway.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for adding course to cart
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddToCartRequest {

    private Long courseId; // ID của khoá học muốn mua
    private String couponCode; // Mã coupon do user nhập (có thể null)
}

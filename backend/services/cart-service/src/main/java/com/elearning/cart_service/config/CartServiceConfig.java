package com.elearning.cart_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import lombok.Getter;

@Configuration
@Getter
public class CartServiceConfig {

    @Value("${service.course-url}")
    private String courseUrl;

    @Value("${service.coupon-url}")
    private String couponUrl;

    @Value("${service.order-url}")
    private String orderUrl;
}

package com.elearning.apigateway.routes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PaymentRoutesConfig {

    @Value("${services.payment-service.url}")
    private String paymentServiceUrl;

    @Value("${services.bff-service.url}")
    private String bffServiceUrl;

    @Bean
    public RouteLocator paymentServiceRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                // Direct routes

                .route("init-payment", r -> r
                        .path("/api/v1/payments/**")
                        .uri(paymentServiceUrl))
                .build();
    }
}

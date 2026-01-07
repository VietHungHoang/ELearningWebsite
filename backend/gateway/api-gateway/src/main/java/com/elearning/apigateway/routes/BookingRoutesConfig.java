package com.elearning.apigateway.routes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BookingRoutesConfig {

    @Value("${services.booking-service.url}")
    private String bookingServiceUrl;

    @Bean
    public RouteLocator bookingServiceRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                // Direct routes
                .route("save-trial-seggggssion", r -> r
                        .path("/api/v1/bookings/**",
                                "/api/v1/discount/**",
                                "/api/v1/tutor/discount/**",
                                "/api/v1/admin/discounts/**")
                        .uri(bookingServiceUrl))

                .build();
    }
}

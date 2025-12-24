package com.elearning.apigateway.routes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BookingRoutesConfig {

    private String bookingServiceUrl = "http://booking-service:8092";

    @Bean
    public RouteLocator bookingServiceRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                // Direct routes
                .route("save-trial-seggggssion", r -> r
                        .path("/api/v1/bookings/**")
                        .uri(bookingServiceUrl)
                )

                .build();
    }
}

package com.elearning.apigateway.routes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AuthRoutesConfig {

    @Value("${services.auth-service.url}")
    private String authServiceUrl;

    @Value("${services.bff-service.url}")
    private String bffServiceUrl;

    @Bean
    public RouteLocator authServiceRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                // Direct routes
                .route("auth", r -> r
                        .path("/api/v1/auth/**")
                        .uri(authServiceUrl))
                .build();
    }
}

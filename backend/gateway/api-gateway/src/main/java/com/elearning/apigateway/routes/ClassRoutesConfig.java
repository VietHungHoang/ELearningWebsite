package com.elearning.apigateway.routes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ClassRoutesConfig {

    @Value("${services.class-service.url}")
    private String classServiceUrl;

    @Value("${services.bff-service.url}")
    private String bffServiceUrl;

    private final String baseClassServiceUrl = classServiceUrl + "api/v1/classes/";
    private final String baseBffServiceUrl = "/api/v1/bff/classes/";

    @Bean
    public RouteLocator bffServiceRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                // Direct routes
                .route("class-sessions", r -> r
                        .path(baseBffServiceUrl + "sessions/**")
                        .uri(bffServiceUrl))
                
                .build();
    }
}

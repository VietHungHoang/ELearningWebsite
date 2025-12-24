package com.elearning.apigateway.routes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SearchRoutesConfig {

    @Value("${services.search-service.url}")
    private String searchServiceUrl;

    @Value("${services.bff-service.url}")
    private String bffServiceUrl;

    @Bean
    public RouteLocator searchServiceRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                // Direct routes
                .route("tutor-search", r -> r
                        .path("/api/v1/public/search/**")
                        .filters(f -> f
                                .rewritePath(
                                        "/api/v1/public/(?<rest>.*)",
                                        "/api/v1/bff/${rest}"
                                )
                        )
                        .uri(bffServiceUrl)
                )
                
                .build();
    }
}

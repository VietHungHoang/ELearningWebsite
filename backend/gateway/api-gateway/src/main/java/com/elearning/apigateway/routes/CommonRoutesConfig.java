package com.elearning.apigateway.routes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CommonRoutesConfig {

    @Value("${services.common-service.url}")
    private String commonServiceUrl;

    @Value("${services.bff-service.url}")
    private String bffServiceUrl;

//    .rewritePath(
//            "/api/v1/(?<rest>.*)",
//                    "/api/v1/bff/${rest}"
//    )

    @Bean
    public RouteLocator commonServiceRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                // Direct routes
                .route("common-search", r -> r
                        .path("/api/v1/public/common/**")
                        .filters(f -> f
                                .rewritePath(
                                        "/api/v1/public/common/(?<rest>.*)",
                                        "/api/v1/common/${rest}"
                                )
                        )
                        .uri(commonServiceUrl))
                
                .build();
    }
}

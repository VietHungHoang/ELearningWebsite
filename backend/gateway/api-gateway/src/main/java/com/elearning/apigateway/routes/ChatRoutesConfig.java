package com.elearning.apigateway.routes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ChatRoutesConfig {

    @Value("${services.chat-service.url}")
    private String chatServiceUrl;

    @Value("${services.bff-service.url}")
    private String bffServiceUrl;

    @Bean
    public RouteLocator chatServiceRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                // Direct routes
                .route("create-chat-conservations", r -> r
                        .path("/api/v1/chat/conversations/**",
                                "/api/v1/chat/messages/**")
                        .uri(chatServiceUrl))

                // Bff routes


                .build();
    }
}

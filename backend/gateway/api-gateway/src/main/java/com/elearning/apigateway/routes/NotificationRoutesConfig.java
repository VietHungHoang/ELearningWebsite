package com.elearning.apigateway.routes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class NotificationRoutesConfig {

        @Value("${services.notification-service.url}")
        private String notificationServiceUrl;

        @Bean
        public RouteLocator notificationServiceRoutes(RouteLocatorBuilder builder) {
                return builder.routes()
                                // Direct routes
                                .route("notification", r -> r
                                                .path(
                                                                "/api/v1/sse/**",
                                                                "/api/v1/notifications/**")
                                                .uri(notificationServiceUrl))

                                .build();
        }
}

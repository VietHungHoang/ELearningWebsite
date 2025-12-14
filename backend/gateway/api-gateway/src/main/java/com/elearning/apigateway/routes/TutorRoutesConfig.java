package com.elearning.apigateway.routes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TutorRoutesConfig {

    @Value("${services.tutor-service.url}")
    private String tutorServiceUrl;

    private final String baseUrl = tutorServiceUrl + "api/v1/tutors/";

    @Bean
    public RouteLocator bffServiceRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                // Direct routes
                .route("tutor-availability", r -> r
                        .path(baseUrl + "{tutorId}/availability/**")
                        .uri(tutorServiceUrl))
                
                .build();
    }
}

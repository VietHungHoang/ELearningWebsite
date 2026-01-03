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

    @Bean
    public RouteLocator classServiceRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                // Direct routes

                .route("save-trial-session", r -> r
                        .path("/api/v1/classes/trial-session/**",
                                "/api/v1/classes/{classId}",
                                "/api/v1/classes/tutors/me",
                                "/api/v1/classes/students/me/**",
                                "/api/v1/classes/sessions/tutors/{tutorId}",
                                "/api/v1/classes/sessions/check-slot-conflicts",
                                "/api/v1/classes/sessions/students/{studentId}",
                                "/api/v1/classes/tutors/{tutorId}/opening",
                                "/api/v1/classes/{classId}/students/{studentId}",
                                "/api/v1/classes/sessions/me/**",
                                "/api/v1/classes/sessions/{sessionId}/reschedule",
                                "/api/v1/classes/reschedule-requests/**")
                        .uri(classServiceUrl))

                .route("class-sessions", r -> r
                        .path("/api/v1/classes/sesttttttsions/**")
                        .filters(f -> f
                                .rewritePath(
                                        "/api/v1/(?<rest>.*)",
                                        "/api/v1/bff/${rest}"
                                )
                        )
                        .uri(bffServiceUrl))

                .build();
    }
}

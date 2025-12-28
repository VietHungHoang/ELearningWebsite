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

    @Value("${services.bff-service.url}")
    private String bffServiceUrl;

    private final String prefix = "/api/v1/tutors/";

    @Bean
    public RouteLocator tutorServiceRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                // Direct routes
                .route("tutor-availability", r -> r
                        .path(
                                prefix + "{tutorId}/availabilities",
                                prefix + "{tutorId}/onboarding",
                                prefix + "me/dashboard/stats",
                                prefix + "me/earnings/**",
                                "/api/v1/public/tutors/{tutorId}"
                                )
                        .filters(f -> f
                                .rewritePath(
                                        "/api/v1/public/(?<rest>.*)",
                                        "/api/v1/${rest}"
                                )
                        )
                        .uri(tutorServiceUrl))

                // Bff routes
                .route("tutor-detail", r -> r
                        .path("/api/v1/tutors/me/dashboard/charts")
                        .filters(f -> f
                                .rewritePath(
                                        "/api/v1/tutors/(?<rest>.*)",
                                        "/api/v1/bff/tutors/${rest}"
                                )
                        )

                        .uri(bffServiceUrl))

                .build();
    }
}

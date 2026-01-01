package com.elearning.apigateway.routes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AdminRoutesConfig {

    @Value("${services.tutor-service.url}")
    private String tutorServiceUrl;

    @Value("${services.class-service.url}")
    private String classServiceUrl;

    @Bean
    public RouteLocator adminServiceRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("tutor-service", r -> r
                        .path(
                                "/api/v1/admin/dashboard/tutor-pending-approvals",
                                "/api/v1/admin/dashboard/new-tutors",
                                "/api/v1/admin/dashboard/new-students"
                                )
                        // .filters(f -> f
                        //         .rewritePath(
                        //                 "/api/v1/admin/dashboard/tutor-pending-approvals",
                        //                 "/api/v1/tutors/pending-approvals"
                        //         )
                        // )
                        .uri(tutorServiceUrl))

                // Bff routes
                .route("class-service", r -> r
                        .path("/api/v1/admin/dashboard/completed-sessions")
                        .uri(classServiceUrl))

                .build();
    }
}

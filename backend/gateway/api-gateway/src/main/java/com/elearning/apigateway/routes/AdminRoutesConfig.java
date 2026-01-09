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

        @Value("${services.payment-service.url}")
        private String paymentServiceUrl;

        @Value("${services.booking-service.url}")
        private String bookingServiceUrl;

        @Bean
        public RouteLocator adminServiceRoutes(RouteLocatorBuilder builder) {
                return builder.routes()
                                .route("tutor-service", r -> r
                                                .path(
                                                                "/api/v1/admin/dashboard/tutor-pending-approvals",
                                                                "/api/v1/admin/dashboard/new-tutors",
                                                                "/api/v1/admin/dashboard/new-students",
                                                                "/api/v1/admin/tutors",
                                                                "/api/v1/admin/tutors/{tutorId}/approve",
                                                                "/api/v1/admin/tutors/{tutorId}/reject",
                                                                "/api/v1/admin/tutors/requests")
                                                .filters(f -> f
                                                                .rewritePath(
                                                                                "/api/v1/admin/tutors$",
                                                                                "/api/v1/tutors")
                                                                .rewritePath(
                                                                                "/api/v1/admin/tutors/(?<rest>.*)",
                                                                                "/api/v1/tutors/${rest}")
                                                                .rewritePath(
                                                                                "/api/v1/admin/dashboard/(?<rest>.*)",
                                                                                "/api/v1/dashboard/${rest}"))

                                                .uri(tutorServiceUrl))

                                // Bff routes
                                .route("class-service", r -> r
                                                .path("/api/v1/admin/dashboard/completed-sessions")
                                                .uri(classServiceUrl))

                                .route("payment-service", r -> r
                                                .path("/api/v1/admin/dashboard/total-revenue")
                                                .filters(f -> f.rewritePath(
                                                                "/api/v1/admin/dashboard/total-revenue",
                                                                "/api/v1/dashboard/total-revenue"))
                                                .uri(paymentServiceUrl))

                                // Admin transactions route - forward to booking-service
                                .route("booking-service-transactions", r -> r
                                                .path("/api/v1/admin/transactions")
                                                .uri(bookingServiceUrl))

                                .build();
        }
}

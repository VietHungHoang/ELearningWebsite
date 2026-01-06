package com.elearning.apigateway.routes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QuizRoutesConfig {

    @Value("${services.quiz-service.url}")
    private String tutorServiceUrl;

    @Bean
    public RouteLocator quizServiceRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                // Direct routes
                .route("quiz", r -> r
                        .path("/api/v1/quizzes/**", "/api/v1/student/quizzes/**")
                        .uri(tutorServiceUrl))
                .build();
    }
}

package com.elearning.authservice.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Data
public class ExternalApiConfig {

    @Value("${notification-service.url:http://localhost:8085}")
    private String notificationServiceUrl;
}
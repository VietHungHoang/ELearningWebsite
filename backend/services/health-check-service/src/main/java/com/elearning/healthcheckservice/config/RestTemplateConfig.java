package com.elearning.healthcheckservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Configuration for RestTemplate bean
 * Required for HealthCheckService to make HTTP calls to other services
 */
@Configuration
public class RestTemplateConfig {

    /**
     * Creates a RestTemplate bean for making HTTP requests
     * Used by HealthCheckService to ping backend services
     *
     * @return RestTemplate instance
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
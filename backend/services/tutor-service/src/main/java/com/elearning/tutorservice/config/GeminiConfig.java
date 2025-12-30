package com.elearning.tutorservice.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
@ConfigurationProperties(prefix = "gemini")
@Data
public class GeminiConfig {
    
    private String apiKey;
    private String apiUrl;
    
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

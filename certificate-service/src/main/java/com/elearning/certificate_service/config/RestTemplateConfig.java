// RestTemplateConfig.java
package com.elearning.certificate_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync; // NEW
import org.springframework.web.client.RestTemplate;

@Configuration
@EnableAsync // <-- bật Spring Async
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

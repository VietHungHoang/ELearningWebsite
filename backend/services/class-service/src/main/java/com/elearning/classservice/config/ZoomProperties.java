package com.elearning.classservice.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "zoom")
@Data
public class ZoomProperties {
    
    private Api api = new Api();
    private Meeting meeting = new Meeting();
    
    @Data
    public static class Api {
        private String baseUrl;
}
    
    @Data
    public static class Meeting {
        private Integer defaultDuration;
        private Boolean waitingRoom;
    }
}

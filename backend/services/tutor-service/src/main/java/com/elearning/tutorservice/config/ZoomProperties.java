package com.elearning.tutorservice.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "zoom")
@Data
public class ZoomProperties {
    
    private OAuth oauth = new OAuth();
    private Api api = new Api();
    private Meeting meeting = new Meeting();
    
    @Data
    public static class OAuth {
        private String clientId;
        private String clientSecret;
        private String redirectUri;
        private String authorizeUrl;
        private String tokenUrl;
    }
    
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

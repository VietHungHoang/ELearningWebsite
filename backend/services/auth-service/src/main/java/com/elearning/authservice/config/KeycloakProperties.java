package com.elearning.authservice.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "keycloak")
@Data
public class KeycloakProperties {

    private String authServerUrl;
    private String publicUrl;  // URL accessible from browser
    private String realm;
    private String resource;
    private String clientSecret;
    private String adminUsername;
    private String adminPassword;
}
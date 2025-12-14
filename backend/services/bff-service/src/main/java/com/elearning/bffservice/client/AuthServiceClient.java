package com.elearning.bffservice.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * Client for Auth Service
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AuthServiceClient {

    private final RestTemplate restTemplate;

    @Value("${services.auth-service.url}")
    private String authServiceBaseUrl;

    /**
     * Assign TUTOR role to user
     */
    public void assignTutorRole(String userId) {
        String url = authServiceBaseUrl + "/api/v1/auth/assign-tutor-role/" + userId;

        try {
            ResponseEntity<Void> response = restTemplate.postForEntity(url, null, Void.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Successfully assigned TUTOR role to user: {}", userId);
            } else {
                throw new RuntimeException("Failed to assign TUTOR role to user: " + userId +
                                         ", status: " + response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("Error assigning TUTOR role to user {}: {}", userId, e.getMessage(), e);
            throw new RuntimeException("Failed to assign TUTOR role to user: " + userId, e);
        }
    }
}
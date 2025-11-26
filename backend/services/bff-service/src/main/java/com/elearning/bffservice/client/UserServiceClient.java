package com.elearning.bffservice.client;

import com.elearning.bffservice.dto.response.UserInfoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Client for User Service
 */
@Component
@RequiredArgsConstructor
public class UserServiceClient {
    
    private final RestTemplate restTemplate;

    @Value("${services.user-service.url}")
    private String userServiceBaseUrl;

    /**
     * Get user by ID
     */
    public UserInfoResponse getUserById(UUID id) {
        Map<UUID, UserInfoResponse> result = batchGetUsers(List.of(id));
        return result.get(id);
    }

    /**
     * Batch get users by IDs
     */
    @SuppressWarnings("unchecked")
    public Map<UUID, UserInfoResponse> batchGetUsers(List<UUID> ids) {
        String url = userServiceBaseUrl + "/api/v1/users/batch";
        
        return (Map<UUID, UserInfoResponse>) restTemplate.postForObject(url, ids, Map.class);
    }

    /**
     * Get user by keycloak ID (alias for getUserById)
     */
    public UserInfoResponse getUserByKeycloakId(UUID keycloakId) {
        return getUserById(keycloakId);
    }
}

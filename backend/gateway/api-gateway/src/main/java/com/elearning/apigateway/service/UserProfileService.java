package com.elearning.apigateway.service;

import com.elearning.apigateway.bff.response.UserProfileResponse;
import com.elearning.apigateway.dto.response.AuthServiceResponse;
import com.elearning.apigateway.dto.response.UserServiceResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserProfileService {

    private final RestTemplate restTemplate;

    @Value("${services.auth-service.url:http://auth-service}")
    private String authServiceUrl;

    @Value("${services.user-service.url:http://user-service}")
    private String userServiceUrl;

    public UserProfileResponse getUserProfile(Long userId) {
        log.info("Fetching user profile for userId: {}", userId);

        UserProfileResponse response = new UserProfileResponse();

        try {
            // Call auth-service for email
            String authUrl = authServiceUrl + "/api/auth/users/" + userId + "/email";
            AuthServiceResponse authResponse = restTemplate.getForObject(authUrl, AuthServiceResponse.class);
            if (authResponse != null) {
                response.setEmail(authResponse.getEmail());
                log.debug("Received email from auth-service: {}", authResponse.getEmail());
            }
        } catch (Exception e) {
            log.error("Failed to get email from auth-service for userId: {}", userId, e);
            response.setEmail("");
        }

        try {
            // Call user-service for profile
            String userUrl = userServiceUrl + "/api/users/" + userId + "/profile";
            UserServiceResponse userResponse = restTemplate.getForObject(userUrl, UserServiceResponse.class);
            if (userResponse != null) {
                response.setName(userResponse.getName());
                response.setAge(userResponse.getAge());
                log.debug("Received profile from user-service: {}", userResponse.getName());
            }
        } catch (Exception e) {
            log.error("Failed to get profile from user-service for userId: {}", userId, e);
            response.setName("");
            response.setAge(null);
        }

        log.info("Combined user profile for userId: {}", userId);
        return response;
    }
}
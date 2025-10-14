package com.elearning.learner_service.client;

import com.elearning.learner_service.dto.request.ProfileUpdateRequest;
import com.elearning.learner_service.dto.response.ProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class UserServiceClient {

    private final RestTemplate restTemplate;

    // Base URL của user-service
    private final String baseUrl = "http://localhost:8083/api/v1/users";

    public ProfileResponse getProfile(Long accountId) {
        String url = baseUrl + "/" + accountId + "/profile";
        return restTemplate.getForObject(url, ProfileResponse.class);
    }

    public ProfileResponse updateProfile(Long accountId, ProfileUpdateRequest profile) {
        String url = baseUrl + "/" + accountId + "/profile";
        restTemplate.put(url, profile);
        return getProfile(accountId); // lấy lại sau khi update
    }
}

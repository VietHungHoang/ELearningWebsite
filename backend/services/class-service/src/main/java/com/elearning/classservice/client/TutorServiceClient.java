package com.elearning.classservice.client;

import com.elearning.classservice.dto.response.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Component
public class TutorServiceClient {

    private final RestTemplate restTemplate;
    private final String serviceUrl;

    public TutorServiceClient(RestTemplate restTemplate, @Value("${services.tutor-service.url}") String serviceUrl) {
        this.restTemplate = restTemplate;
        this.serviceUrl = serviceUrl;
    }

    public String getZoomAccessToken(UUID tutorId) {
        String url = serviceUrl + "/internal/tutors/zoom/" + tutorId + "/token";
        
        try {
            ResponseEntity<ApiResponse<String>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<ApiResponse<String>>() {}
            );
            
            if (response.getBody() != null && response.getBody().getData() != null) {
                return response.getBody().getData();
            }
            throw new RuntimeException("Empty response from Tutor Service");
        } catch (Exception e) {
            throw new RuntimeException("Failed to get Zoom access token from Tutor Service: " + e.getMessage());
        }
    }
}

package com.elearning.bffservice.client;

import com.elearning.bffservice.dto.response.StudentProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

/**
 * Client for Student Service
 */
@Component
@RequiredArgsConstructor
public class StudentServiceClient {
    
    private final RestTemplate restTemplate;

    @Value("${services.student-service.url}")
    private String studentServiceBaseUrl;

    /**
     * Get student profile by ID
     */
    public StudentProfileResponse getStudentById(UUID studentId) {
        String url = studentServiceBaseUrl + "/api/v1/students/" + studentId;
        
        return restTemplate.exchange(
            url,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<StudentProfileResponse>() {}
        ).getBody();
    }
}

package com.elearning.bffservice.client;

import com.elearning.bffservice.dto.ApiResponse;
import com.elearning.bffservice.dto.student.response.StudentResponse;
import com.elearning.bffservice.dto.tutor.response.UserInfoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class StudentServiceClient {
    
    private final RestTemplate restTemplate;

    @Value("${services.student-service.url}")
    private String studentServiceBaseUrl;

    public List<StudentResponse> getStudentsByIds(List<UUID> studentIds) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(studentServiceBaseUrl + "/api/v1/students/batch");
        for (UUID id : studentIds) {
            builder.queryParam("ids", id.toString());
        }
        String url = builder.toUriString();

        ApiResponse<List<StudentResponse>> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<ApiResponse<List<StudentResponse>>>() {}
        ).getBody();

        if (response != null) {
            return response.getData();
        }

        return List.of();
    }

    public List<UserInfoResponse> getStudentBasicInfosByIds(List<UUID> studentIds) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(studentServiceBaseUrl + "/api/v1/students/users/batch");
        for (UUID id : studentIds) {
            builder.queryParam("ids", id.toString());
        }
        String url = builder.toUriString();

        ApiResponse<List<UserInfoResponse>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<ApiResponse<List<UserInfoResponse>>>() {}
        ).getBody();

        if (response != null) {
            return response.getData();
        }

        return List.of();
    }
}

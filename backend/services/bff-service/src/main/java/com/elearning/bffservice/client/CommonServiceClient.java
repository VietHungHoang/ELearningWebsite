package com.elearning.bffservice.client;

import com.elearning.bffservice.dto.ApiResponse;
import com.elearning.bffservice.dto.response.CategoryResponse;
import com.elearning.bffservice.dto.response.SubjectResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CommonServiceClient {
    private final RestTemplate restTemplate;

    @Value("${services.common-service.url}")
    private String commonServiceBaseUrl;

    public List<CategoryResponse> getAllCategories() {
        try {
            String url = commonServiceBaseUrl + "/api/v1/common/categories";
            List<CategoryResponse> result = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<CategoryResponse>>() {
                    }).getBody();
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch categories", e);
        }
    }

    public List<SubjectResponse> getAllSubjects() {
        try {
            String url = commonServiceBaseUrl + "/api/v1/common/subjects";
            ApiResponse<List<SubjectResponse>> result = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<ApiResponse<List<SubjectResponse>>>() {
                    }).getBody();
            return result.getData();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch subjects", e);
        }
    }
}
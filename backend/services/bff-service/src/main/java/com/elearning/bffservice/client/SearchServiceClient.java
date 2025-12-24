package com.elearning.bffservice.client;

import com.elearning.bffservice.dto.RestResponsePage;
import com.elearning.bffservice.dto.request.SearchTutorRequest;
import com.elearning.bffservice.dto.ApiResponse;
import com.elearning.bffservice.dto.tutor.response.TutorSearchResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.UUID;

/**
 * Client for Search Service API
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SearchServiceClient {
    
    private final RestTemplate restTemplate;

    @Value("${services.search-service.url}")
    private String searchServiceBaseUrl;

    public Page<TutorSearchResult> searchTutors(SearchTutorRequest request) {
        try {
            String url = searchServiceBaseUrl + "/api/v1/search/tutors";
            
            HttpEntity<SearchTutorRequest> entity = new HttpEntity<>(request);
            
            ResponseEntity<ApiResponse<RestResponsePage<TutorSearchResult>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<>() {
                    }
            );
            
            if (response.getBody() != null && response.getBody().getData() != null) {
                return response.getBody().getData();
            } else {
                log.warn("Search service returned null or empty data");
                return Page.empty();
            }
            
        } catch (Exception e) {
            log.error("Failed to search tutors via Search Service", e);
            throw new RuntimeException("Search service unavailable", e);
        }
    }
}

package com.elearning.searchservice.client;

import com.elearning.searchservice.dto.sync.CategorySyncDto;
import com.elearning.searchservice.dto.sync.SubjectSyncDto;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

/**
 * REST client to call common-service APIs
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CommonServiceClient {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${services.common-service.url:http://localhost:8084}")
    private String commonServiceUrl;

    /**
     * Fetch all categories from common-service
     */
    public List<CategorySyncDto> getAllCategories() {
        try {
            String url = commonServiceUrl + "/api/v1/common/categories";
            log.info("Fetching categories from: {}", url);
            
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode dataNode = root.path("data");
            
            if (dataNode.isMissingNode()) {
                log.warn("No data field in categories response");
                return Collections.emptyList();
            }
            
            List<CategorySyncDto> categories = objectMapper.convertValue(
                dataNode, 
                new TypeReference<List<CategorySyncDto>>() {}
            );
            
            log.info("Fetched {} categories from common-service", categories.size());
            return categories;
        } catch (Exception e) {
            log.error("Failed to fetch categories from common-service: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    /**
     * Fetch all subjects from common-service
     */
    public List<SubjectSyncDto> getAllSubjects() {
        try {
            String url = commonServiceUrl + "/api/v1/common/subjects";
            log.info("Fetching subjects from: {}", url);
            
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode dataNode = root.path("data");
            
            if (dataNode.isMissingNode()) {
                log.warn("No data field in subjects response");
                return Collections.emptyList();
            }
            
            List<SubjectSyncDto> subjects = objectMapper.convertValue(
                dataNode, 
                new TypeReference<List<SubjectSyncDto>>() {}
            );
            
            log.info("Fetched {} subjects from common-service", subjects.size());
            return subjects;
        } catch (Exception e) {
            log.error("Failed to fetch subjects from common-service: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }
}

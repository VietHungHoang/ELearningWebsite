package com.elearning.apigateway.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class CourseServiceClient {

    private final RestTemplate restTemplate;

    @Value("${services.course-service.url}")
    private String baseUrl;

    @Cacheable(value = "courses", key = "#courseId")
    public Map<String, Object> getCourseInfo(Long courseId) {
        try {
            String url = baseUrl + "/" + courseId;
            return restTemplate.getForObject(url, Map.class);
        } catch (RestClientException e) {
            log.error("Error getting course info for courseId: {}", courseId, e);
            return Map.of(
                    "courseId", courseId,
                    "title", "Course " + courseId,
                    "thumbnail", "https://placeholder.com/300x200",
                    "price", 0.0,
                    "rating", 0.0);
        }
    }

    public Map<String, Object> searchCourses(String keyword, Integer page, Integer size) {
        try {
            String url = baseUrl + "/search?keyword=" + keyword + "&page=" + page + "&size=" + size;
            return restTemplate.getForObject(url, Map.class);
        } catch (RestClientException e) {
            log.error("Error searching courses with keyword: {}", keyword, e);
            return Map.of("courses", java.util.List.of());
        }
    }
}


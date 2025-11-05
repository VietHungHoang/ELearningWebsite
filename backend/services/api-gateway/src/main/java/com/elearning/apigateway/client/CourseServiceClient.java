package com.elearning.apigateway.client;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import com.elearning.apigateway.dto.response.ApiResponse;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CourseServiceClient {

    private final RestTemplate restTemplate;

    @Value("${services.course-service.url}")
    private String courseServiceBaseUrl;

    public CourseBasicInfo getCourseBasicInfo(Long courseId) {
        try {
            String url = courseServiceBaseUrl + "/api/courses/" + courseId + "/basic-info";

            ResponseEntity<ApiResponse<CourseBasicInfo>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<ApiResponse<CourseBasicInfo>>() {
                    });

            return response.getBody() != null ? response.getBody().getData() : null;
        } catch (Exception e) {
            return null; // Return null instead of throwing to allow graceful degradation
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CourseBasicInfo {
        private Long id;
        private String title;
        private String instructorName;
        private BigDecimal price;
        private List<String> availableCoupons;
    }
}
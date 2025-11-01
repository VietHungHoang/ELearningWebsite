package com.elearning.cart_service.client;

import com.elearning.cart_service.config.CartServiceConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class CourseClient {

    private final RestTemplate restTemplate;
    private final CartServiceConfig config;

    public CourseDTO getCourseById(Long courseId) {
        String url = config.getCourseUrl() + "/" + courseId;
        return restTemplate.getForObject(url, CourseDTO.class);
    }

    @lombok.Data
    public static class CourseDTO {
        private Long id;
        private String title;
        private Double listPrice;
        private Double discountPrice;
        private Boolean isActive;
        private String instructorName;
        private String thumbnailUrl;
    }
}
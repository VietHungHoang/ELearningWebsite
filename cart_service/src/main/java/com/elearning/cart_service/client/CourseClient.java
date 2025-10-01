package com.elearning.cart_service.client;

import com.elearning.cart_service.config.CartServiceConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * Gọi API Course Service
 */
@Component
@RequiredArgsConstructor
public class CourseClient {

    private final RestTemplate restTemplate;
    private final CartServiceConfig config;

    /**
     * Lấy thông tin course (giá, title, trạng thái)
     */
    public CourseDTO getCourseById(Long courseId) {
        String url = config.getCourseUrl() + "/" + courseId;
        return restTemplate.getForObject(url, CourseDTO.class);
    }

    /**
     * DTO đơn giản cho dữ liệu từ Course Service
     */
    @lombok.Data
    public static class CourseDTO {
        private Long id;
        private String title;
        private Double listPrice;
        private Double discountPrice;
        private Boolean isActive; // trạng thái course còn bán không
    }
}

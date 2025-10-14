package com.elearning.learner_service.client;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
// import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CourseServiceClient {

    // private final RestTemplate restTemplate;

    // private final String baseUrl = "http://localhost:8084/api/v1/courses";

    // public Map<String, Object> getCourseInfo(Long courseId) {
    // String url = baseUrl + "/" + courseId;
    // return restTemplate.getForObject(url, Map.class);
    // }
    public Map<String, Object> getCourseInfo(Long courseId) {
        // Mock data tạm
        Map<String, Object> courseInfo = new HashMap<>();
        courseInfo.put("title", "Java Spring Boot " + courseId);
        courseInfo.put("thumbnail", "https://example.com/course" + courseId + ".jpg");
        courseInfo.put("description", "Khóa học Spring Boot từ cơ bản đến nâng cao");
        courseInfo.put("totalStudents", 1234);
        courseInfo.put("totalLessons", 45);
        courseInfo.put("price", 199.99);
        courseInfo.put("totalReviews", 300);
        courseInfo.put("rating", 4.5);
        return courseInfo;
    }
}

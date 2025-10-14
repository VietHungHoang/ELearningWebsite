package com.elearning.learner_service.client;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class QuizServiceClient {

    private final RestTemplate restTemplate;
    private final String baseUrl = "http://localhost:8085/api/v1/quizzes"; // URL quiz-service

    public Map<String, Object> getQuizInfo(Long quizId) {
        String url = baseUrl + "/" + quizId;
        // Gọi tới quiz-service và nhận response Map
        return restTemplate.getForObject(url, Map.class);
    }
}

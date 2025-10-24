package com.elearning.learner_bff_service.client;

import com.elearning.learner_bff_service.dto.request.QuizAttemptRequest;
import com.elearning.learner_bff_service.dto.response.QuizAttemptResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class QuizAttemptClient {

    private final RestTemplate restTemplate;

    @Value("${services.learner-service.url}")
    private String baseUrl;

    public QuizAttemptResponse createAttempt(QuizAttemptRequest request) {
        try {
            String url = baseUrl + "/learners/quiz-attempts";
            return restTemplate.postForObject(url, request, QuizAttemptResponse.class);
        } catch (Exception e) {
            log.error("Error creating quiz attempt", e);
            throw e;
        }
    }

    public List<QuizAttemptResponse> getMyAttempts(Long accountId) {
        try {
            String url = baseUrl + "/learners/quiz-attempts/" + accountId;
            var response = restTemplate.exchange(url, HttpMethod.GET, null,
                    new ParameterizedTypeReference<Map<String, List<QuizAttemptResponse>>>() {
                    });

            if (response.getBody() != null) {
                Map<String, List<QuizAttemptResponse>> body = response.getBody();
                if (body != null && body.containsKey("data")) {
                    return body.get("data");
                }
            }
            return List.of();
        } catch (Exception e) {
            log.error("Error getting quiz attempts for accountId: {}", accountId, e);
            return List.of();
        }
    }
}

package com.elearning.learner_bff_service.client;

import com.elearning.learner_bff_service.dto.request.ReviewRequest;
import com.elearning.learner_bff_service.dto.response.ReviewResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class ReviewClient {

    private final RestTemplate restTemplate;

    @Value("${services.learner-service.url}")
    private String baseUrl;

    public ReviewResponse createReview(ReviewRequest request) {
        try {
            String url = baseUrl + "/learners/reviews";
            return restTemplate.postForObject(url, request, ReviewResponse.class);
        } catch (Exception e) {
            log.error("Error creating review", e);
            throw e;
        }
    }

    public ReviewResponse updateReview(ReviewRequest request) {
        try {
            String url = baseUrl + "/learners/reviews";
            return restTemplate.exchange(url, HttpMethod.PUT, new HttpEntity<>(request),
                    ReviewResponse.class).getBody();
        } catch (Exception e) {
            log.error("Error updating review", e);
            throw e;
        }
    }

    public void deleteReview(Long accountId, Long courseId) {
        try {
            String url = baseUrl + "/learners/reviews/" + accountId + "/" + courseId;
            restTemplate.delete(url);
        } catch (Exception e) {
            log.error("Error deleting review for accountId: {}, courseId: {}", accountId, courseId, e);
            throw e;
        }
    }

    public List<ReviewResponse> getMyReviews(Long accountId) {
        try {
            String url = baseUrl + "/learners/reviews/" + accountId;
            var response = restTemplate.exchange(url, HttpMethod.GET, null,
                    new ParameterizedTypeReference<Map<String, List<ReviewResponse>>>() {
                    });

            if (response.getBody() != null) {
                Map<String, List<ReviewResponse>> body = response.getBody();
                if (body != null && body.containsKey("data")) {
                    return body.get("data");
                }
            }
            return List.of();
        } catch (Exception e) {
            log.error("Error getting reviews for accountId: {}", accountId, e);
            return List.of();
        }
    }
}

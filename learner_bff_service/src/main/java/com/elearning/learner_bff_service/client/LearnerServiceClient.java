package com.elearning.learner_bff_service.client;

import com.elearning.learner_bff_service.dto.request.EnrollmentRequest;
import com.elearning.learner_bff_service.dto.request.ReviewRequest;
import com.elearning.learner_bff_service.dto.request.WishlistRequest;
import com.elearning.learner_bff_service.dto.request.QuizAttemptRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class LearnerServiceClient {

    private final RestTemplate restTemplate;

    @Value("${services.learner-service.url}")
    private String baseUrl;

    public Map<String, Object> getProfile(Long accountId) {
        try {
            String url = baseUrl + "/profile/" + accountId;
            return restTemplate.getForObject(url, Map.class);
        } catch (RestClientException e) {
            log.error("Error getting profile for accountId: {}", accountId, e);
            throw e;
        }
    }

    public Map<String, Object> updateProfile(Long accountId, Map<String, Object> profileUpdate) {
        try {
            String url = baseUrl + "/profile/" + accountId;
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(profileUpdate);
            var response = restTemplate.exchange(url, HttpMethod.PATCH, request, Map.class);
            return response.getBody() != null ? response.getBody() : Map.of();
        } catch (RestClientException e) {
            log.error("Error updating profile for accountId: {}", accountId, e);
            throw e;
        }
    }

    public List<Map<String, Object>> getEnrollments(Long accountId) {
        try {
            String url = baseUrl + "/enrollments/" + accountId;
            var response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("data")) {
                return (List<Map<String, Object>>) response.get("data");
            }
            return List.of();
        } catch (RestClientException e) {
            log.error("Error getting enrollments for accountId: {}", accountId, e);
            return List.of();
        }
    }

    public Map<String, Object> getEnrollment(Long accountId, Long courseId) {
        try {
            String url = baseUrl + "/enrollments/" + accountId + "/" + courseId;
            return restTemplate.getForObject(url, Map.class);
        } catch (RestClientException e) {
            log.error("Error getting enrollment for accountId: {}, courseId: {}", accountId, courseId, e);
            return Map.of();
        }
    }

    public Integer getWishlistCount(Long accountId) {
        try {
            String url = baseUrl + "/wishlist/" + accountId + "/count";
            var response = restTemplate.getForObject(url, Map.class);
            return response != null ? (Integer) response.get("count") : 0;
        } catch (RestClientException e) {
            log.error("Error getting wishlist count for accountId: {}", accountId, e);
            return 0;
        }
    }

    public List<Map<String, Object>> getRecentReviews(Long accountId, Integer limit) {
        try {
            String url = baseUrl + "/reviews/" + accountId + "?limit=" + limit;
            var response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("data")) {
                return (List<Map<String, Object>>) response.get("data");
            }
            return List.of();
        } catch (RestClientException e) {
            log.error("Error getting recent reviews for accountId: {}", accountId, e);
            return List.of();
        }
    }

    public Map<String, Object> enrollCourse(EnrollmentRequest request) {
        try {
            String url = baseUrl + "/enrollments";
            HttpEntity<EnrollmentRequest> httpRequest = new HttpEntity<>(request);
            var response = restTemplate.postForObject(url, httpRequest, Map.class);
            return response != null ? response : Map.of();
        } catch (RestClientException e) {
            log.error("Error enrolling course", e);
            throw e;
        }
    }

    public Map<String, Object> startCourse(Long accountId, Long courseId) {
        try {
            String url = baseUrl + "/enrollments/" + accountId + "/" + courseId + "/start";
            var response = restTemplate.postForObject(url, null, Map.class);
            return response != null ? response : Map.of();
        } catch (RestClientException e) {
            log.error("Error starting course", e);
            throw e;
        }
    }

    public Map<String, Object> completeCourse(Long accountId, Long courseId) {
        try {
            String url = baseUrl + "/enrollments/" + accountId + "/" + courseId + "/complete";
            var response = restTemplate.postForObject(url, null, Map.class);
            return response != null ? response : Map.of();
        } catch (RestClientException e) {
            log.error("Error completing course", e);
            throw e;
        }
    }

    public Map<String, Object> createReview(ReviewRequest request) {
        try {
            String url = baseUrl + "/reviews";
            HttpEntity<ReviewRequest> httpRequest = new HttpEntity<>(request);
            var response = restTemplate.postForObject(url, httpRequest, Map.class);
            return response != null ? response : Map.of();
        } catch (RestClientException e) {
            log.error("Error creating review", e);
            throw e;
        }
    }

    public Map<String, Object> updateReview(ReviewRequest request) {
        try {
            String url = baseUrl + "/reviews";
            HttpEntity<ReviewRequest> httpRequest = new HttpEntity<>(request);
            var response = restTemplate.exchange(url, HttpMethod.PUT, httpRequest, Map.class);
            return response.getBody() != null ? response.getBody() : Map.of();
        } catch (RestClientException e) {
            log.error("Error updating review", e);
            throw e;
        }
    }

    public void deleteReview(Long accountId, Long courseId) {
        try {
            String url = baseUrl + "/reviews/" + accountId + "/" + courseId;
            restTemplate.delete(url);
        } catch (RestClientException e) {
            log.error("Error deleting review", e);
            throw e;
        }
    }

    public List<Map<String, Object>> getMyReviews(Long accountId) {
        try {
            String url = baseUrl + "/reviews/" + accountId;
            var response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("data")) {
                return (List<Map<String, Object>>) response.get("data");
            }
            return List.of();
        } catch (RestClientException e) {
            log.error("Error getting reviews", e);
            return List.of();
        }
    }

    public Map<String, Object> addToWishlist(WishlistRequest request) {
        try {
            String url = baseUrl + "/wishlist";
            HttpEntity<WishlistRequest> httpRequest = new HttpEntity<>(request);
            var response = restTemplate.postForObject(url, httpRequest, Map.class);
            return response != null ? response : Map.of();
        } catch (RestClientException e) {
            log.error("Error adding to wishlist", e);
            throw e;
        }
    }

    public List<Map<String, Object>> getWishlist(Long accountId) {
        try {
            String url = baseUrl + "/wishlist/" + accountId;
            var response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("data")) {
                return (List<Map<String, Object>>) response.get("data");
            }
            return List.of();
        } catch (RestClientException e) {
            log.error("Error getting wishlist", e);
            return List.of();
        }
    }

    public void removeFromWishlist(Long accountId, Long courseId) {
        try {
            String url = baseUrl + "/wishlist/" + accountId + "/" + courseId;
            restTemplate.delete(url);
        } catch (RestClientException e) {
            log.error("Error removing from wishlist", e);
            throw e;
        }
    }

    public Map<String, Object> createQuizAttempt(QuizAttemptRequest request) {
        try {
            String url = baseUrl + "/quiz-attempts";
            HttpEntity<QuizAttemptRequest> httpRequest = new HttpEntity<>(request);
            var response = restTemplate.postForObject(url, httpRequest, Map.class);
            return response != null ? response : Map.of();
        } catch (RestClientException e) {
            log.error("Error creating quiz attempt", e);
            throw e;
        }
    }

    public List<Map<String, Object>> getMyQuizAttempts(Long accountId) {
        try {
            String url = baseUrl + "/quiz-attempts/" + accountId;
            var response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("data")) {
                return (List<Map<String, Object>>) response.get("data");
            }
            return List.of();
        } catch (RestClientException e) {
            log.error("Error getting quiz attempts", e);
            return List.of();
        }
    }
}

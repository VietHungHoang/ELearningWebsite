package com.elearning.apigateway.client;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import com.elearning.apigateway.dto.request.NotificationRequest;
import com.elearning.apigateway.dto.response.ApiResponse;
import com.elearning.apigateway.dto.response.NotificationResponse;

@Component
@RequiredArgsConstructor
public class NotificationServiceClient {

    private final RestTemplate restTemplate;

    @Value("${services.notification-service.url}")
    private String notificationServiceBaseUrl;

    public NotificationResponse createNotification(NotificationRequest request) {
        try {
            String url = notificationServiceBaseUrl + "/api/v1/notifications";
            ApiResponse<NotificationResponse> apiResponse = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    new HttpEntity<>(request),
                    new ParameterizedTypeReference<ApiResponse<NotificationResponse>>() {
                    }).getBody();
            return apiResponse != null ? apiResponse.getData() : null;
        } catch (Exception e) {
            return null;
        }
    }

    public List<NotificationResponse> getUserNotifications(String userId, int page, int size) {
        try {
            String url = notificationServiceBaseUrl + "/api/v1/notifications/user/" + userId + "?page=" + page
                    + "&size=" + size;
            ApiResponse<List<NotificationResponse>> apiResponse = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<ApiResponse<List<NotificationResponse>>>() {
                    }).getBody();
            return apiResponse != null ? apiResponse.getData() : null;
        } catch (Exception e) {
            return null;
        }
    }

    public Long getUnreadCount(String userId) {
        try {
            String url = notificationServiceBaseUrl + "/api/v1/notifications/user/" + userId + "/unread-count";
            ApiResponse<Long> apiResponse = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<ApiResponse<Long>>() {
                    }).getBody();
            return apiResponse != null ? apiResponse.getData() : 0L;
        } catch (Exception e) {
            return 0L;
        }
    }

    public Long markAllAsRead(String userId) {
        try {
            String url = notificationServiceBaseUrl + "/api/v1/notifications/user/" + userId + "/mark-all-as-read";
            ApiResponse<Long> apiResponse = restTemplate.exchange(
                    url,
                    HttpMethod.PUT,
                    null,
                    new ParameterizedTypeReference<ApiResponse<Long>>() {
                    }).getBody();
            return apiResponse != null ? apiResponse.getData() : 0L;
        } catch (Exception e) {
            return 0L;
        }
    }

    public NotificationResponse markAsRead(String notificationId, String userId) {
        try {
            String url = notificationServiceBaseUrl + "/api/v1/notifications/" + notificationId
                    + "/mark-as-read?userId=" + userId;
            ApiResponse<NotificationResponse> apiResponse = restTemplate.exchange(
                    url,
                    HttpMethod.PUT,
                    null,
                    new ParameterizedTypeReference<ApiResponse<NotificationResponse>>() {
                    }).getBody();
            return apiResponse != null ? apiResponse.getData() : null;
        } catch (Exception e) {
            return null;
        }
    }
}
package com.elearning.apigateway.client;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import com.elearning.apigateway.dto.request.NotificationRequest;
import com.elearning.apigateway.dto.response.ApiResponse;
import com.elearning.apigateway.dto.response.NotificationResponse;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationServiceClient {

    private final RestTemplate restTemplate;

    @Value("${services.notification-service.url}")
    private String notificationServiceBaseUrl;

    public List<NotificationResponse> getAllNotifications() {
        try {
            String url = notificationServiceBaseUrl + "/api/v1/notifications";
            log.info("Fetching all notifications from: {}", url);
            ApiResponse<List<NotificationResponse>> apiResponse = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<ApiResponse<List<NotificationResponse>>>() {
                    }).getBody();
            return apiResponse != null ? apiResponse.getData() : null;
        } catch (Exception e) {
            log.error("Error fetching all notifications", e);
            throw new RuntimeException("Failed to fetch notifications", e);
        }
    }

    public NotificationResponse getNotificationById(Long id) {
        try {
            String url = notificationServiceBaseUrl + "/api/v1/notifications/" + id;
            log.info("Fetching notification by id from: {}", url);
            ApiResponse<NotificationResponse> apiResponse = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<ApiResponse<NotificationResponse>>() {
                    }).getBody();
            return apiResponse != null ? apiResponse.getData() : null;
        } catch (Exception e) {
            log.error("Error fetching notification with id: {}", id, e);
            throw new RuntimeException("Failed to fetch notification", e);
        }
    }

    public NotificationResponse createNotification(NotificationRequest request) {
        try {
            String url = notificationServiceBaseUrl + "/api/v1/notifications";
            log.info("Creating notification at: {}", url);
            ApiResponse<NotificationResponse> apiResponse = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    new HttpEntity<>(request),
                    new ParameterizedTypeReference<ApiResponse<NotificationResponse>>() {
                    }).getBody();
            return apiResponse != null ? apiResponse.getData() : null;
        } catch (Exception e) {
            log.error("Error creating notification", e);
            throw new RuntimeException("Failed to create notification", e);
        }
    }

    public NotificationResponse updateNotification(Long id, NotificationRequest request) {
        try {
            String url = notificationServiceBaseUrl + "/api/v1/notifications/" + id;
            log.info("Updating notification at: {}", url);
            ApiResponse<NotificationResponse> apiResponse = restTemplate.exchange(
                    url,
                    HttpMethod.PUT,
                    new HttpEntity<>(request),
                    new ParameterizedTypeReference<ApiResponse<NotificationResponse>>() {
                    }).getBody();
            return apiResponse != null ? apiResponse.getData() : null;
        } catch (Exception e) {
            log.error("Error updating notification with id: {}", id, e);
            throw new RuntimeException("Failed to update notification", e);
        }
    }

    public void deleteNotification(Long id) {
        try {
            String url = notificationServiceBaseUrl + "/api/v1/notifications/" + id;
            log.info("Deleting notification at: {}", url);
            restTemplate.delete(url);
        } catch (Exception e) {
            log.error("Error deleting notification with id: {}", id, e);
            throw new RuntimeException("Failed to delete notification", e);
        }
    }

    public NotificationResponse markAsRead(Long id) {
        try {
            String url = notificationServiceBaseUrl + "/api/v1/notifications/" + id + "/mark-as-read";
            log.info("Marking notification as read at: {}", url);
            ApiResponse<NotificationResponse> apiResponse = restTemplate.exchange(
                    url,
                    HttpMethod.PUT,
                    null,
                    new ParameterizedTypeReference<ApiResponse<NotificationResponse>>() {
                    }).getBody();
            return apiResponse != null ? apiResponse.getData() : null;
        } catch (Exception e) {
            log.error("Error marking notification as read with id: {}", id, e);
            throw new RuntimeException("Failed to mark notification as read", e);
        }
    }

    public NotificationResponse markAsUnread(Long id) {
        try {
            String url = notificationServiceBaseUrl + "/api/v1/notifications/" + id + "/mark-as-unread";
            log.info("Marking notification as unread at: {}", url);
            ApiResponse<NotificationResponse> apiResponse = restTemplate.exchange(
                    url,
                    HttpMethod.PUT,
                    null,
                    new ParameterizedTypeReference<ApiResponse<NotificationResponse>>() {
                    }).getBody();
            return apiResponse != null ? apiResponse.getData() : null;
        } catch (Exception e) {
            log.error("Error marking notification as unread with id: {}", id, e);
            throw new RuntimeException("Failed to mark notification as unread", e);
        }
    }

    public void markAllAsRead() {
        try {
            String url = notificationServiceBaseUrl + "/api/v1/notifications/mark-all-as-read";
            log.info("Marking all notifications as read at: {}", url);
            restTemplate.put(url, null);
        } catch (Exception e) {
            log.error("Error marking all notifications as read", e);
            throw new RuntimeException("Failed to mark all notifications as read", e);
        }
    }

    public Long getUnreadCount() {
        try {
            String url = notificationServiceBaseUrl + "/api/v1/notifications/unread-count";
            log.info("Fetching unread notifications count from: {}", url);
            ApiResponse<Long> apiResponse = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<ApiResponse<Long>>() {
                    }).getBody();
            return apiResponse != null ? apiResponse.getData() : 0L;
        } catch (Exception e) {
            log.error("Error fetching unread notifications count", e);
            return 0L;
        }
    }

    public List<NotificationResponse> getUserNotifications(Long userId, int page, int size) {
        try {
            String url = notificationServiceBaseUrl + "/api/v1/notifications/user/" + userId + "?page=" + page
                    + "&size=" + size;
            log.info("Fetching user notifications from: {}", url);
            ApiResponse<List<NotificationResponse>> apiResponse = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<ApiResponse<List<NotificationResponse>>>() {
                    }).getBody();
            return apiResponse != null ? apiResponse.getData() : null;
        } catch (Exception e) {
            log.error("Error fetching user notifications for user: {}", userId, e);
            throw new RuntimeException("Failed to fetch user notifications", e);
        }
    }

    public Long getUnreadCount(Long userId) {
        try {
            String url = notificationServiceBaseUrl + "/api/v1/notifications/user/" + userId + "/unread-count";
            log.info("Fetching unread notifications count for user: {}", userId);
            ApiResponse<Long> apiResponse = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<ApiResponse<Long>>() {
                    }).getBody();
            return apiResponse != null ? apiResponse.getData() : 0L;
        } catch (Exception e) {
            log.error("Error fetching unread notifications count for user: {}", userId, e);
            return 0L;
        }
    }

    public Long markAllAsRead(Long userId) {
        try {
            String url = notificationServiceBaseUrl + "/api/v1/notifications/user/" + userId + "/mark-all-as-read";
            log.info("Marking all notifications as read for user: {}", userId);
            ApiResponse<Long> apiResponse = restTemplate.exchange(
                    url,
                    HttpMethod.PUT,
                    null,
                    new ParameterizedTypeReference<ApiResponse<Long>>() {
                    }).getBody();
            return apiResponse != null ? apiResponse.getData() : 0L;
        } catch (Exception e) {
            log.error("Error marking all notifications as read for user: {}", userId, e);
            throw new RuntimeException("Failed to mark all notifications as read", e);
        }
    }

    public NotificationResponse markAsRead(String notificationId, Long userId) {
        try {
            String url = notificationServiceBaseUrl + "/api/v1/notifications/" + notificationId
                    + "/mark-as-read?userId=" + userId;
            log.info("Marking notification as read: {} for user: {}", notificationId, userId);
            ApiResponse<NotificationResponse> apiResponse = restTemplate.exchange(
                    url,
                    HttpMethod.PUT,
                    null,
                    new ParameterizedTypeReference<ApiResponse<NotificationResponse>>() {
                    }).getBody();
            return apiResponse != null ? apiResponse.getData() : null;
        } catch (Exception e) {
            log.error("Error marking notification as read: {} for user: {}", notificationId, userId, e);
            throw new RuntimeException("Failed to mark notification as read", e);
        }
    }
}
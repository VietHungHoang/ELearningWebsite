package com.elearning.notification_service.controller;

import com.elearning.notification_service.dto.request.NotificationRequest;
import com.elearning.notification_service.dto.response.NotificationResponse;
import com.elearning.notification_service.service.NotificationService;
import com.elearning.notification_service.dto.response.ApiResponse;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NotificationResponse>> createNotification(
            @RequestBody NotificationRequest request) {

        NotificationResponse response = notificationService.createNotification(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Notification created successfully."));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getUserNotifications(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        List<NotificationResponse> notifications = notificationService
                .getUserNotifications(userId, pageable);

        return ResponseEntity.ok(ApiResponse.success(notifications, "Fetch notifications successfully."));
    }
    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@PathVariable Long userId) {
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(ApiResponse.success(count, "Fetch unread count successfully."));
    }
    @PostMapping("/user/{userId}/mark-all-read")
    public ResponseEntity<ApiResponse<Long>> markAllAsRead(@PathVariable Long userId) {
        long updatedCount = notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.success(updatedCount, "All notifications marked as read."));
    }
    @PostMapping("/{notificationId}/user/{userId}/mark-read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(@PathVariable String notificationId,
            @PathVariable Long userId) {
        NotificationResponse response = notificationService.markAsRead(notificationId, userId);
        return ResponseEntity.ok(ApiResponse.success(response, "Notification marked as read."));
    }
}

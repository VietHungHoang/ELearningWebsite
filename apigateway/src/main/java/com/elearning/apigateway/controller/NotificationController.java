package com.elearning.apigateway.controller;

import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.elearning.apigateway.dto.request.NotificationRequest;
import com.elearning.apigateway.dto.response.ApiResponse;
import com.elearning.apigateway.dto.response.NotificationResponse;
import com.elearning.apigateway.service.NotificationService;

/**
 * REST Controller cho Notification
 * Nhận requests từ FE và xử lý qua NotificationService
 */
@Slf4j
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * POST /api/notifications
     * Tạo notification mới (có gửi WebSocket)
     */
    @PostMapping
    public ResponseEntity<ApiResponse<NotificationResponse>> createNotification(
            @RequestBody NotificationRequest request) {
        log.info("POST create notification for user: {}", request.getUserId());

        NotificationResponse response = notificationService.createNotification(request);

        ApiResponse<NotificationResponse> apiResponse = new ApiResponse<>(
                HttpStatus.CREATED.value(),
                "Notification created successfully.",
                response);

        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    /**
     * GET /api/notifications/user/{userId}
     * Lấy notifications của user theo phân trang
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getUserNotifications(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("GET notifications for user: {}, page: {}, size: {}", userId, page, size);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        List<NotificationResponse> notifications = notificationService.getUserNotifications(userId, pageable);

        ApiResponse<List<NotificationResponse>> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Fetch notifications successfully.",
                notifications);

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/notifications/user/{userId}/unread-count
     * Lấy số lượng notifications chưa đọc
     */
    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@PathVariable Long userId) {
        log.info("GET unread count for user: {}", userId);

        long count = notificationService.getUnreadCount(userId);

        ApiResponse<Long> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Fetch unread count successfully.",
                count);

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/notifications/user/{userId}/mark-all-read
     * Đánh dấu tất cả notifications là đã đọc
     */
    @PostMapping("/user/{userId}/mark-all-read")
    public ResponseEntity<ApiResponse<Long>> markAllAsRead(@PathVariable Long userId) {
        log.info("POST mark all notifications as read for user: {}", userId);

        long updatedCount = notificationService.markAllAsRead(userId);

        ApiResponse<Long> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "All notifications marked as read.",
                updatedCount);

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/notifications/{notificationId}/user/{userId}/mark-read
     * Đánh dấu 1 notification là đã đọc
     */
    @PostMapping("/{notificationId}/user/{userId}/mark-read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(
            @PathVariable String notificationId,
            @PathVariable Long userId) {
        log.info("POST mark notification as read: {} for user: {}", notificationId, userId);

        NotificationResponse response = notificationService.markAsRead(notificationId, userId);

        ApiResponse<NotificationResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Notification marked as read.",
                response);

        return ResponseEntity.ok(apiResponse);
    }
}

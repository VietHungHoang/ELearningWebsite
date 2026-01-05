package com.elearning.notificationservice.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.elearning.notificationservice.dto.response.ApiResponse;
import com.elearning.notificationservice.dto.response.NotificationResponse;
import com.elearning.notificationservice.service.NotificationService;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getUserNotifications(
            @RequestHeader("X-User-Id") String userIdStr,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        UUID userId = UUID.fromString(userIdStr);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        List<NotificationResponse> notifications = notificationService
                .getUserNotifications(userId, pageable);

        return ResponseEntity.ok(ApiResponse.success(notifications, "Fetch notifications successfully."));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@RequestHeader("X-User-Id") String userIdStr) {
        UUID userId = UUID.fromString(userIdStr);
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(ApiResponse.success(count, "Fetch unread count successfully."));
    }

    @PutMapping("/mark-all-read")
    public ResponseEntity<ApiResponse<Long>> markAllAsRead(@RequestHeader("X-User-Id") String userIdStr) {
        UUID userId = UUID.fromString(userIdStr);
        long updatedCount = notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.success(updatedCount, "All notifications marked as read."));
    }

    @PutMapping("/{notificationId}/mark-read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(
            @PathVariable UUID notificationId,
            @RequestHeader("X-User-Id") String userIdStr) {
        UUID userId = UUID.fromString(userIdStr);
        NotificationResponse response = notificationService.markAsRead(notificationId, userId);
        return ResponseEntity.ok(ApiResponse.success(response, "Notification marked as read."));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Void>> sendOtpEmail(@RequestParam String email, @RequestParam String otp) {
        notificationService.sendOtpEmail(email, otp);
        return ResponseEntity.ok(ApiResponse.success(null, "OTP email sent successfully."));
    }
}

package com.elearning.bffservice.controller;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import com.elearning.bffservice.dto.request.NotificationRequest;
import com.elearning.bffservice.dto.ApiResponse;
import com.elearning.bffservice.service.NotificationService;
import com.elearning.bffservice.dto.response.NotificationResponse;

@RestController
@RequestMapping("/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

        private final NotificationService notificationService;

        @PostMapping
        public ResponseEntity<ApiResponse<NotificationResponse>> createNotification(
                        @RequestBody NotificationRequest request) {
                // Default to "1001" if userId is null
                String effectiveUserId = request.getUserId() != null ? request.getUserId() : "1001";

                // Update request with effective userId
                request.setUserId(effectiveUserId);

                NotificationResponse response = notificationService.createNotification(request);

                ApiResponse<NotificationResponse> apiResponse = ApiResponse.success(response,
                                "Notification created successfully.");

                return ResponseEntity.status(201).body(apiResponse);
        }

//        @GetMapping("/user/{userId}")
//        public ResponseEntity<ApiResponse<ViewNotificationBFFResponse>> getUserNotifications(
//                        @PathVariable String userId,
//                        @RequestParam(defaultValue = "0") int page,
//                        @RequestParam(defaultValue = "10") int size) {
//                // Default to "1001" if userId is null or empty
//                String effectiveUserId = (userId == null || userId.trim().isEmpty()) ? "1001" : userId;
//
//                Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
//                ViewNotificationBFFResponse notifications = notificationService
//                                .getUserNotifications(effectiveUserId, pageable);
//
//                ApiResponse<ViewNotificationBFFResponse> response = ApiResponse.success(notifications,
//                                "Fetch notifications successfully.");
//
//                return ResponseEntity.ok(response);
//        }
//
//        @PostMapping("/user/{userId}/mark-all-read")
//        public ResponseEntity<ApiResponse<MarkAllAsReadBFFResponse>> markAllAsRead(@PathVariable String userId) {
//                // Default to "1001" if userId is null or empty
//                String effectiveUserId = (userId == null || userId.trim().isEmpty()) ? "1001" : userId;
//
//                MarkAllAsReadBFFResponse updatedCount = notificationService
//                                .markAllAsRead(effectiveUserId);
//
//                ApiResponse<MarkAllAsReadBFFResponse> response = ApiResponse.success(updatedCount,
//                                "All notifications marked as read.");
//
//                return ResponseEntity.ok(response);
//        }
//
//        @PostMapping("/{notificationId}/user/{userId}/mark-read")
//        public ResponseEntity<ApiResponse<MarkAsReadBFFResponse>> markAsRead(
//                        @PathVariable String notificationId,
//                        @PathVariable String userId) {
//                String effectiveUserId = (userId == null || userId.trim().isEmpty()) ? "1001" : userId;
//
//                MarkAsReadBFFResponse response = notificationService.markAsRead(notificationId,
//                                effectiveUserId);
//
//                ApiResponse<MarkAsReadBFFResponse> apiResponse = ApiResponse.success(response,
//                                "Notification marked as read.");
//
//                return ResponseEntity.ok(apiResponse);
//        }
}

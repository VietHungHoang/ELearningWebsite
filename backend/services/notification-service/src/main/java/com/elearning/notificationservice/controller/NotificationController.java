// package com.elearning.notificationservice.controller;

// import lombok.RequiredArgsConstructor;

// import org.springframework.data.domain.PageRequest;
// import org.springframework.data.domain.Pageable;
// import org.springframework.data.domain.Sort;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import com.elearning.notificationservice.dto.request.NotificationRequest;
// import com.elearning.notificationservice.dto.response.ApiResponse;
// import com.elearning.notificationservice.dto.response.NotificationResponse;
// import com.elearning.notificationservice.service.NotificationService;

// import java.util.List;
// import java.util.UUID;

// @RestController
// @RequiredArgsConstructor
// @RequestMapping("/api/notification")
// public class NotificationController {

//     private final NotificationService notificationService;

//     @PostMapping
//     public ResponseEntity<ApiResponse<NotificationResponse>> createNotification(
//             @RequestBody NotificationRequest request) {

//         NotificationResponse response = notificationService.createNotification(request);
//         return ResponseEntity.ok(ApiResponse.success(response, "Notification created successfully."));
//     }

//     @GetMapping("/user/{userId}")
//     public ResponseEntity<ApiResponse<List<NotificationResponse>>> getUserNotifications(
//             @PathVariable UUID userId,
//             @RequestParam(defaultValue = "0") int page,
//             @RequestParam(defaultValue = "10") int size) {

//         Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
//         List<NotificationResponse> notifications = notificationService
//                 .getUserNotifications(userId, pageable);

//         return ResponseEntity.ok(ApiResponse.success(notifications, "Fetch notifications successfully."));
//     }

//     @GetMapping("/user/{userId}/unread-count")
//     public ResponseEntity<ApiResponse<Long>> getUnreadCount(@PathVariable UUID userId) {
//         long count = notificationService.getUnreadCount(userId);
//         return ResponseEntity.ok(ApiResponse.success(count, "Fetch unread count successfully."));
//     }

//     @PutMapping("/user/{userId}/mark-all-as-read")
//     public ResponseEntity<ApiResponse<Long>> markAllAsRead(@PathVariable UUID userId) {
//         long updatedCount = notificationService.markAllAsRead(userId);
//         return ResponseEntity.ok(ApiResponse.success(updatedCount, "All notifications marked as read."));
//     }

//     @PutMapping("/{notificationId}/mark-as-read")
//     public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(@PathVariable UUID notificationId,
//             @RequestParam UUID userId) {
//         NotificationResponse response = notificationService.markAsRead(notificationId, userId);
//         return ResponseEntity.ok(ApiResponse.success(response, "Notification marked as read."));
//     }

//     @PostMapping("/send-otp")
//     public ResponseEntity<ApiResponse<Void>> sendOtpEmail(@RequestParam String email, @RequestParam String otp) {
//         notificationService.sendOtpEmail(email, otp);
//         return ResponseEntity.ok(ApiResponse.success(null, "OTP email sent successfully."));
//     }
// }

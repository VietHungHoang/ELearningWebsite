// package com.elearning.notificationservice.mapper;

// import org.springframework.stereotype.Component;

// import com.elearning.notificationservice.dto.request.NotificationRequest;
// import com.elearning.notificationservice.dto.response.NotificationResponse;
// import com.elearning.notificationservice.model.Notification;

// import java.time.LocalDateTime;

// @Component
// public class NotificationMapper {

//     public Notification mapToEntity(NotificationRequest request) {
//         return Notification.builder()
//                 .userId(request.getUserId())
//                 .type(request.getType())
//                 .title(request.getTitle())
//                 .message(request.getMessage())
//                 .isRead(false)
//                 .createdAt(LocalDateTime.now())
//                 .metadata(request.getMetadata())
//                 .build();
//     }

//     public NotificationResponse mapToResponse(Notification n) {
//         return NotificationResponse.builder()
//                 .id(n.getId())
//                 .userId(n.getUserId())
//                 .type(n.getType())
//                 .title(n.getTitle())
//                 .message(n.getMessage())
//                 .read(n.isRead())
//                 .createdAt(n.getCreatedAt())
//                 .metadata(n.getMetadata())
//                 .build();
//     }
// }
package com.elearning.apigateway.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.elearning.apigateway.dto.response.NotificationResponse;

/**
 * Service để gửi WebSocket messages
 * Sử dụng để gửi real-time notifications tới FE
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Gửi notification cho user cụ thể
     *
     * @param userId       User ID nhận notification
     * @param notification Notification object
     */
    public void sendNotificationToUser(Long userId, NotificationResponse notification) {
        try {
            // Gửi tới /user/{userId}/queue/notifications
            messagingTemplate.convertAndSendToUser(
                    userId.toString(),
                    "/queue/notifications",
                    notification);

            log.info("WebSocket notification sent to user: {} - {}", userId, notification.getId());
        } catch (Exception e) {
            log.error("Error sending WebSocket notification to user: {}", userId, e);
        }
    }
}

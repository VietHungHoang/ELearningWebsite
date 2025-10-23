package com.elearning.chat_service.service.impl;

import com.elearning.chat_service.service.PushNotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class PushNotificationServiceImpl implements PushNotificationService {

    @Override
    public void sendPushNotification(String userId, String title, String message) {
        // TODO: Tích hợp với Firebase/APNs trong production
        // Hiện tại chỉ log để demo

        log.info("📱 PUSH NOTIFICATION to user {}: {} - {}", userId, title, message);

        // Mock implementation - in production sẽ gọi:
        // firebaseMessaging.send(Message.builder()
        // .setToken(userDeviceToken)
        // .setNotification(Notification.builder()
        // .setTitle(title)
        // .setBody(message)
        // .build())
        // .build());
    }

    @Override
    public void sendMessageNotification(String recipientId, String senderName, String messageContent) {
        String title = "New Message";
        String message = senderName + ": " + messageContent;

        // Truncate message if too long
        if (message.length() > 100) {
            message = senderName + ": " + messageContent.substring(0, 97) + "...";
        }

        sendPushNotification(recipientId, title, message);
    }
}

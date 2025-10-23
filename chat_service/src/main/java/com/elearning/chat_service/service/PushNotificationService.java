package com.elearning.chat_service.service;

public interface PushNotificationService {
    void sendPushNotification(String userId, String title, String message);

    void sendMessageNotification(String recipientId, String senderName, String messageContent);
}

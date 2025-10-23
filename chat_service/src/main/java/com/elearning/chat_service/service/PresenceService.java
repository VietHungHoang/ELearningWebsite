package com.elearning.chat_service.service;

public interface PresenceService {
    void userConnected(String userId, String sessionId);

    void userDisconnected(String userId);

    boolean isUserOnline(String userId);

    String getUserStatus(String userId);

    void refreshPresence(String userId);

    // Unread message count tracking
    void incrementUnreadCount(String userId);

    void resetUnreadCount(String userId);

    int getUnreadCount(String userId);
}

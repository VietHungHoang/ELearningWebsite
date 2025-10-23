package com.elearning.chat_service.service.impl;

import com.elearning.chat_service.service.PresenceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class PresenceServiceImpl implements PresenceService {

    private final RedisTemplate<String, Object> redisTemplate;
    private static final long PRESENCE_TTL = 5; // 5 minutes

    @Override
    public void userConnected(String userId, String sessionId) {
        String presenceKey = "presence:" + userId;
        String statusKey = "status:" + userId;

        redisTemplate.opsForValue().set(presenceKey, sessionId, PRESENCE_TTL, TimeUnit.MINUTES);
        redisTemplate.opsForValue().set(statusKey, "online", PRESENCE_TTL, TimeUnit.MINUTES);

        log.info("User connected: {} with session: {}", userId, sessionId);
    }

    @Override
    public void userDisconnected(String userId) {
        String presenceKey = "presence:" + userId;
        String statusKey = "status:" + userId;

        redisTemplate.delete(presenceKey);
        redisTemplate.opsForValue().set(statusKey, "offline");

        log.info("User disconnected: {}", userId);
    }

    @Override
    public boolean isUserOnline(String userId) {
        String presenceKey = "presence:" + userId;
        Boolean hasKey = redisTemplate.hasKey(presenceKey);
        return hasKey != null && hasKey;
    }

    @Override
    public String getUserStatus(String userId) {
        String statusKey = "status:" + userId;
        Object status = redisTemplate.opsForValue().get(statusKey);
        return status != null ? status.toString() : "offline";
    }

    @Override
    public void refreshPresence(String userId) {
        String presenceKey = "presence:" + userId;
        String statusKey = "status:" + userId;

        // Refresh TTL
        redisTemplate.expire(presenceKey, PRESENCE_TTL, TimeUnit.MINUTES);
        redisTemplate.expire(statusKey, PRESENCE_TTL, TimeUnit.MINUTES);

        log.debug("Presence refreshed for user: {}", userId);
    }

    @Override
    public void incrementUnreadCount(String userId) {
        String unreadKey = "unread:" + userId;
        redisTemplate.opsForValue().increment(unreadKey);
        log.debug("Incremented unread count for user: {}", userId);
    }

    @Override
    public void resetUnreadCount(String userId) {
        String unreadKey = "unread:" + userId;
        redisTemplate.opsForValue().set(unreadKey, "0");
        log.debug("Reset unread count for user: {}", userId);
    }

    @Override
    public int getUnreadCount(String userId) {
        String unreadKey = "unread:" + userId;
        String count = (String) redisTemplate.opsForValue().get(unreadKey);
        return count != null ? Integer.parseInt(count) : 0;
    }
}
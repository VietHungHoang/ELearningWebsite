package com.elearning.notificationservice.sse;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Thread-safe manager for SSE (Server-Sent Events) emitters.
 * Stores one emitter per userId for real-time notification push.
 */
@Component
@Slf4j
public class SseEmitterManager {

    // Default timeout: 30 minutes (in milliseconds)
    private static final long DEFAULT_TIMEOUT = 30 * 60 * 1000L;

    // Thread-safe map: userId -> SseEmitter
    private final Map<UUID, SseEmitter> emitters = new ConcurrentHashMap<>();

    /**
     * Create and register a new SSE emitter for a user.
     * If user already has an emitter, the old one is completed first.
     */
    public SseEmitter createEmitter(UUID userId) {
        // Remove existing emitter if any
        removeEmitter(userId);

        SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);

        // Set up callbacks for cleanup
        emitter.onCompletion(() -> {
            log.info("SSE connection completed for user: {}", userId);
            emitters.remove(userId);
        });

        emitter.onTimeout(() -> {
            log.info("SSE connection timed out for user: {}", userId);
            emitters.remove(userId);
        });

        emitter.onError(ex -> {
            log.warn("SSE connection error for user {}: {}", userId, ex.getMessage());
            emitters.remove(userId);
        });

        emitters.put(userId, emitter);
        log.info("Created new SSE emitter for user: {}", userId);

        return emitter;
    }

    /**
     * Get existing emitter for a user, or null if not connected.
     */
    public SseEmitter getEmitter(UUID userId) {
        return emitters.get(userId);
    }

    /**
     * Remove and complete an emitter for a user.
     */
    public void removeEmitter(UUID userId) {
        SseEmitter existing = emitters.remove(userId);
        if (existing != null) {
            try {
                existing.complete();
            } catch (Exception e) {
                log.debug("Error completing existing emitter for user {}: {}", userId, e.getMessage());
            }
        }
    }

    /**
     * Send data to a specific user's emitter.
     * Returns true if sent successfully, false if user not connected.
     */
    public boolean sendToUser(UUID userId, Object data) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter == null) {
            log.debug("No SSE connection for user: {}", userId);
            return false;
        }

        try {
            emitter.send(SseEmitter.event()
                    .name("notification")
                    .data(data));
            log.debug("Sent SSE notification to user: {}", userId);
            return true;
        } catch (Exception e) {
            log.warn("Failed to send SSE to user {}: {}", userId, e.getMessage());
            removeEmitter(userId);
            return false;
        }
    }

    /**
     * Get the number of currently connected users.
     */
    public int getConnectionCount() {
        return emitters.size();
    }
}

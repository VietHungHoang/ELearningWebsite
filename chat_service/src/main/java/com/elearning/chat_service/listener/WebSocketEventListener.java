package com.elearning.chat_service.listener;

import com.elearning.chat_service.service.PresenceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final PresenceService presenceService;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        try {
            SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.wrap(event.getMessage());
            String sessionId = headerAccessor.getSessionId();
            String userId = extractUserIdFromHeader(headerAccessor);

            if (userId != null && sessionId != null) {
                presenceService.userConnected(userId, sessionId);
                log.info("User {} connected with session {}", userId, sessionId);
            }
        } catch (Exception e) {
            log.error("Error handling WebSocket connect event", e);
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        try {
            SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.wrap(event.getMessage());
            String userId = extractUserIdFromHeader(headerAccessor);

            if (userId != null) {
                presenceService.userDisconnected(userId);
                log.info("User {} disconnected", userId);
            }
        } catch (Exception e) {
            log.error("Error handling WebSocket disconnect event", e);
        }
    }

    private String extractUserIdFromHeader(SimpMessageHeaderAccessor headerAccessor) {
        // Try to get userId from nativeHeader
        Object nativeHeaders = headerAccessor.getNativeHeader("userId");
        if (nativeHeaders instanceof java.util.List) {
            java.util.List<?> headers = (java.util.List<?>) nativeHeaders;
            if (!headers.isEmpty()) {
                return headers.get(0).toString();
            }
        }

        // Fallback: Try to get from session attributes
        Object userId = headerAccessor.getSessionAttributes() != null
                ? headerAccessor.getSessionAttributes().get("userId")
                : null;
        return userId != null ? userId.toString() : null;
    }
}

package com.elearning.notificationservice.controller;

import com.elearning.notificationservice.sse.SseEmitterManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.UUID;

/**
 * SSE (Server-Sent Events) endpoint for real-time notifications.
 * Clients connect to this endpoint to receive push notifications.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/sse")
@Slf4j
public class SseController {

    private final SseEmitterManager emitterManager;

    /**
     * SSE subscription endpoint.
     * Client connects here to receive real-time notifications.
     * 
     * Usage: GET /api/v1/sse/subscribe/{userId}
     * Response: text/event-stream
     */
    @GetMapping(value = "/subscribe/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@PathVariable UUID userId) {
        log.info("New SSE subscription request from user: {}", userId);

        SseEmitter emitter = emitterManager.createEmitter(userId);

        // Send initial connection confirmation
        try {
            emitter.send(SseEmitter.event()
                    .name("connected")
                    .data("{\"status\":\"connected\",\"userId\":\"" + userId + "\"}"));
        } catch (Exception e) {
            log.warn("Failed to send connection confirmation to user {}: {}", userId, e.getMessage());
        }

        return emitter;
    }

    /**
     * Health check endpoint to verify SSE service status.
     */
    @GetMapping("/health")
    public String health() {
        return "{\"status\":\"ok\",\"connections\":" + emitterManager.getConnectionCount() + "}";
    }
}

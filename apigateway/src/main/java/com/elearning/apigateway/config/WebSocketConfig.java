package com.elearning.apigateway.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket Configuration
 * Cấu hình để hỗ trợ real-time notifications
 * 
 * Sử dụng Spring WebSocket + STOMP (Simple Text Oriented Messaging Protocol)
 * 
 * FE sẽ kết nối đến: ws://localhost:8083/ws
 * Sau đó subscribe vào /user/{userId}/queue/notifications để nhận real-time
 * updates
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Cấu hình message broker - nơi nhận/gửi messages
        config.enableSimpleBroker("/topic", "/queue");

        // Prefix cho app destinations (nơi controller lắng nghe)
        config.setApplicationDestinationPrefixes("/app");

        // Prefix cho user-specific destinations
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Đăng ký WebSocket endpoint
        // FE sẽ kết nối đến ws://localhost:3000/ws
        registry.addEndpoint("/ws")
                .setAllowedOrigins(
                        "http://localhost:5107",
                        "http://127.0.0.1:5107")
                .withSockJS(); // Fallback cho browsers không support WebSocket
    }
}

package com.elearning.notificationservice.listener;

import com.elearning.notificationservice.dto.event.NotificationEvent;
import com.elearning.notificationservice.service.NotificationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationEventListener {

    private final NotificationService notificationService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "create-notification", groupId = "notification-service-group")
    public void handleNotificationEvent(String message) {
        log.info("Received raw message from Kafka: {}", message);
        try {
            // Deserialize JSON string to NotificationEvent object
            NotificationEvent event = objectMapper.readValue(message, NotificationEvent.class);
            log.info("Deserialized notification event: userId={}, type={}, title={}",
                     event.getUserId(), event.getType(), event.getTitle());
            
            // Create notification
            notificationService.createNotification(event);
            log.info("Notification created successfully for user {}", event.getUserId());
        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize message: {}", e.getMessage(), e);
        } catch (Exception e) {
            log.error("Failed to create notification: {}", e.getMessage(), e);
        }
    }
}
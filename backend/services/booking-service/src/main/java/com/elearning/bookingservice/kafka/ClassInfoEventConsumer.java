package com.elearning.bookingservice.kafka;

import com.elearning.bookingservice.dto.event.ClassCreatedEvent;
import com.elearning.bookingservice.service.ClassInfoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Kafka consumer for class-related events from class-service
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ClassInfoEventConsumer {

    private final ClassInfoService classInfoService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "class_created_booking", groupId = "booking-service-group")
    public void handleClassCreatedEvent(String message) {
        try {
            log.info("Received class created event: {}", message);
            ClassCreatedEvent event = objectMapper.readValue(message, ClassCreatedEvent.class);
            classInfoService.handleClassCreatedEvent(event);
        } catch (Exception e) {
            log.error("Error processing class created event: {}", e.getMessage(), e);
        }
    }
}

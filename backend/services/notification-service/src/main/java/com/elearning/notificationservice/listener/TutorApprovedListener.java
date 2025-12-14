package com.elearning.notificationservice.listener;

import com.elearning.notificationservice.dto.event.TutorApprovedEvent;
import com.elearning.notificationservice.service.EmailService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TutorApprovedListener {

    private final EmailService emailService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "tutor-approved", groupId = "notification-service-group")
    public void handleTutorApproved(String message) {
        log.info("Received raw message from Kafka: {}", message);
        try {
            // Deserialize JSON string to TutorApprovedEvent object
            TutorApprovedEvent event = objectMapper.readValue(message, TutorApprovedEvent.class);
            log.info("Deserialized tutor approved event: tutorId={}, email={}, fullName={}",
                     event.getTutorId(), event.getEmail(), event.getFullName());

            // Send approval email
            emailService.sendTutorApprovalEmail(event.getEmail(), event.getFullName());
            log.info("Tutor approval email sent successfully to {}", event.getEmail());
        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize message: {}", e.getMessage(), e);
        } catch (Exception e) {
            log.error("Failed to send tutor approval email: {}", e.getMessage(), e);
        }
    }
}
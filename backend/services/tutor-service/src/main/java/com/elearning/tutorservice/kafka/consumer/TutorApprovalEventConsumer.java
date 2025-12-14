package com.elearning.tutorservice.kafka.consumer;

import com.elearning.tutorservice.dto.event.TutorRoleAssignedEvent;
import com.elearning.tutorservice.service.TutorService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TutorApprovalEventConsumer {

    private final TutorService tutorService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "tutor_role_assigned", groupId = "tutor-service")
    public void handleTutorRoleAssigned(String message) {
        log.info("Received raw message from Kafka: {}", message);
        try {
            TutorRoleAssignedEvent event = objectMapper.readValue(message, TutorRoleAssignedEvent.class);
            log.info("Deserialized tutor role assigned event: userId={}", event.getUserId());
            
            UUID tutorId = UUID.fromString(event.getUserId());
            tutorService.approveTutor(tutorId);
            log.info("Successfully processed tutor approval for: {}", tutorId);
        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize message: {}", e.getMessage(), e);
        } catch (Exception e) {
            log.error("Failed to process tutor approval for message {}: {}", message, e.getMessage(), e);
        }
    }
}
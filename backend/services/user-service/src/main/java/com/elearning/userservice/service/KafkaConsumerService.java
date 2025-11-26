package com.elearning.userservice.service;

import com.elearning.userservice.dto.event.TutorProfileUpdatedEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumerService {

    private final ObjectMapper objectMapper;
    private final UserService userService;

    private static final String TUTOR_PROFILE_UPDATED_TOPIC = "tutor-profile-updated";

    @KafkaListener(topics = TUTOR_PROFILE_UPDATED_TOPIC, groupId = "user-service-group")
    public void handleTutorProfileUpdated(String message) {
        try {
            TutorProfileUpdatedEvent event = objectMapper.readValue(message, TutorProfileUpdatedEvent.class);
            log.info("Received tutor profile updated event for tutor: {}", event.getTutorId());

            // Update tutor profile in user-service database
            userService.updateTutorProfile(event);

        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize tutor profile updated event", e);
        } catch (Exception e) {
            log.error("Failed to process tutor profile updated event", e);
        }
    }
}
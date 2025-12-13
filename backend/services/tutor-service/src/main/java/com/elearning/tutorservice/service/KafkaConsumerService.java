package com.elearning.tutorservice.service;

import com.elearning.tutorservice.dto.event.AccountCreatedEvent;
import com.elearning.tutorservice.dto.event.TutorProfileUpdatedEvent;
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
    private final TutorService tutorService;

    private static final String TUTOR_PROFILE_UPDATED_TOPIC = "tutor-profile-updated";
    private static final String ACCOUNT_CREATED_TOPIC = "tutor_account_created";

    @KafkaListener(topics = TUTOR_PROFILE_UPDATED_TOPIC, groupId = "tutor-service-group")
    public void handleTutorProfileUpdated(String message) {
        try {
            TutorProfileUpdatedEvent event = objectMapper.readValue(message, TutorProfileUpdatedEvent.class);
            log.info("Received tutor profile updated event for tutor: {}", event.getTutorId());

            // Update tutor profile in database
            tutorService.updateTutorProfile(event);

        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize tutor profile updated event", e);
        } catch (Exception e) {
            log.error("Failed to process tutor profile updated event", e);
        }
    }

    @KafkaListener(topics = ACCOUNT_CREATED_TOPIC, groupId = "tutor-service-group")
    public void handleAccountCreated(String message) {
        try {
            AccountCreatedEvent event = objectMapper.readValue(message, AccountCreatedEvent.class);
            log.info("Received account created event for user: {}", event.getId());

            // Create tutor onboarding if user is a tutor
            tutorService.createTutorOnboarding(event);

        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize account created event", e);
        } catch (Exception e) {
            log.error("Failed to process account created event", e);
        }
    }
}

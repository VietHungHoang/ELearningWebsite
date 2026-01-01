package com.elearning.tutorservice.kafka.consumer;

import com.elearning.tutorservice.dto.event.AccountCreatedEvent;
import com.elearning.tutorservice.service.TutorOnboardingService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class TutorOnboardingConsumer {

    private final ObjectMapper objectMapper;
    private final TutorOnboardingService tutorOnboardingService;

    private static final String ACCOUNT_CREATED_TOPIC = "tutor_account_created";

    @KafkaListener(topics = ACCOUNT_CREATED_TOPIC, groupId = "tutor-service-group")
    public void handleAccountCreated(String message) {
        try {
            AccountCreatedEvent event = objectMapper.readValue(message, AccountCreatedEvent.class);
            log.info("Received account created event for user: {}", event.getId());
            tutorOnboardingService.createTutorOnboarding(event);

        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize account created event", e);
        } catch (Exception e) {
            log.error("Failed to process account created event", e);
        }
    }
}

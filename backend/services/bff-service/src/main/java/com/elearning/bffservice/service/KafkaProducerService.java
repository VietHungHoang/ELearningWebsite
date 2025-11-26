package com.elearning.bffservice.service;

import com.elearning.bffservice.dto.event.TutorProfileUpdatedEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaProducerService {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    private static final String TUTOR_PROFILE_UPDATED_TOPIC = "tutor-profile-updated";

    public void sendTutorProfileUpdatedEvent(TutorProfileUpdatedEvent event) {
        try {
            String message = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(TUTOR_PROFILE_UPDATED_TOPIC, event.getTutorId().toString(), message);
            log.info("Sent tutor profile updated event for tutor: {}", event.getTutorId());
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize tutor profile updated event", e);
            throw new RuntimeException("Failed to send tutor profile updated event", e);
        }
    }
}
package com.elearning.tutorservice.kafka.consumer;

import com.elearning.tutorservice.dto.event.SessionStartedEvent;
import com.elearning.tutorservice.service.TutorEarningsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

/**
 * Consumer for session started events from class-service
 * Creates TutorEarnings record when a session is started by tutor
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SessionStartedConsumer {

    private static final String SESSION_STARTED_TOPIC = "session_started";
    
    private final TutorEarningsService tutorEarningsService;
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @KafkaListener(topics = SESSION_STARTED_TOPIC, groupId = "tutor-service-earnings-group")
    public void handleSessionStarted(String message) {
        try {
            log.info("Received session started event: {}", message);
            SessionStartedEvent event = objectMapper.readValue(message, SessionStartedEvent.class);
            
            // Skip trial sessions (they don't generate earnings)
            if (Boolean.TRUE.equals(event.getIsTrial())) {
                log.info("Skipping earnings creation for trial session: {}", event.getSessionId());
                return;
            }
            
            // Create earnings record
            tutorEarningsService.createEarningsFromSessionStart(event);
            
            log.info("Successfully created earnings for session {} by tutor {}", 
                    event.getSessionId(), event.getTutorId());
        } catch (Exception e) {
            log.error("Error processing session started event: {}", e.getMessage(), e);
            // Don't throw - allow Kafka to continue processing other messages
        }
    }
}

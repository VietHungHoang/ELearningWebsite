package com.elearning.classservice.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

/**
 * Kafka producer service for publishing events
 * Pattern from auth-service
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaProducerService {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String SESSION_STARTED_TOPIC = "session_started";

    public void sendMessage(String topic, String key, Object message) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(message);
            kafkaTemplate.send(topic, key, jsonMessage);
            log.info("Sent message to topic {} with key {}: {}", topic, key, jsonMessage);
        } catch (JsonProcessingException e) {
            log.error("Error converting message to JSON: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to serialize message", e);
        }
    }

    public void sendSessionStartedEvent(Object event) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(SESSION_STARTED_TOPIC, jsonMessage);
            log.info("Sent session started event to topic {}: {}", SESSION_STARTED_TOPIC, jsonMessage);
        } catch (JsonProcessingException e) {
            log.error("Error converting SessionStartedEvent to JSON: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to serialize SessionStartedEvent", e);
        }
    }

    private static final String TUTOR_HOURLY_RATE_REQUEST_TOPIC = "request_tutor_hourly_rate";

    public void sendTutorHourlyRateRequest(Object event) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(TUTOR_HOURLY_RATE_REQUEST_TOPIC, jsonMessage);
            log.info("Sent tutor hourly rate request to topic {}: {}", TUTOR_HOURLY_RATE_REQUEST_TOPIC, jsonMessage);
        } catch (JsonProcessingException e) {
            log.error("Error converting TutorHourlyRateRequestEvent to JSON: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to serialize TutorHourlyRateRequestEvent", e);
        }
    }
}

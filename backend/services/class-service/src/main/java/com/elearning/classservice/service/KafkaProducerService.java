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
    private final ObjectMapper objectMapper;

    private static final String SESSION_STARTED_TOPIC = "session_started";
    private static final String TUTOR_HOURLY_RATE_REQUEST_TOPIC = "request_tutor_hourly_rate";
    private static final String CLASS_NOTIFICATION_TOPIC = "class_notification";
    private static final String CLASS_CREATED_BOOKING_TOPIC = "class_created_booking";
    private static final String CLASS_CREATED_STUDENT_TOPIC = "class_created_student";

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

    /**
     * Send class full event when a class reaches maximum capacity
     * Notification service will send emails to tutor and students
     */
    public void sendClassFullEvent(Object event) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(CLASS_NOTIFICATION_TOPIC, jsonMessage);
            log.info("Sent class full event to topic {}: {}", CLASS_NOTIFICATION_TOPIC, jsonMessage);
        } catch (JsonProcessingException e) {
            log.error("Error converting ClassFullEvent to JSON: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to serialize ClassFullEvent", e);
        }
    }

    /**
     * Send class created event to booking-service
     * Used to update booking record with class info after class creation
     */
    public void sendClassCreatedEvent(Object event) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(CLASS_CREATED_BOOKING_TOPIC, jsonMessage);
            log.info("Sent class created event to topic {}: {}", CLASS_CREATED_BOOKING_TOPIC, jsonMessage);
        } catch (JsonProcessingException e) {
            log.error("Error converting ClassCreatedEvent to JSON: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to serialize ClassCreatedEvent", e);
        }
    }

    /**
     * Send class created event to tutor-service (or student-service)
     * Used to increment totalStudents count when a NEW class is created
     */
    public void sendClassCreatedForStudentEvent(Object event) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(CLASS_CREATED_STUDENT_TOPIC, jsonMessage);
            log.info("Sent class created for student event to topic {}: {}", CLASS_CREATED_STUDENT_TOPIC, jsonMessage);
        } catch (JsonProcessingException e) {
            log.error("Error converting ClassCreatedForStudentEvent to JSON: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to serialize ClassCreatedForStudentEvent", e);
        }
    }

    private static final String SESSION_REMINDER_TOPIC = "session_reminder";

    /**
     * Send session reminder event 15 minutes before session starts
     * Notification service will send email and in-app notification to students
     */
    public void sendSessionReminderEvent(Object event) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(SESSION_REMINDER_TOPIC, jsonMessage);
            log.info("Sent session reminder event to topic {}: {}", SESSION_REMINDER_TOPIC, jsonMessage);
        } catch (JsonProcessingException e) {
            log.error("Error converting SessionReminderEvent to JSON: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to serialize SessionReminderEvent", e);
        }
    }
}

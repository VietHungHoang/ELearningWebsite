package com.elearning.authservice.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.elearning.authservice.dto.event.AccountCreatedEvent;
import com.elearning.authservice.dto.event.EmailOtpEvent;
import com.elearning.authservice.dto.event.TutorRoleAssignedEvent;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

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

    public void sendMessage(String topic, Object message) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(message);
            kafkaTemplate.send(topic, jsonMessage);
            log.info("Sent message to topic {}: {}", topic, jsonMessage);
        } catch (JsonProcessingException e) {
            log.error("Error converting message to JSON: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to serialize message", e);
        }
    }

    public void sendToNotificationOTPEmail(EmailOtpEvent message) {
        sendMessage(KafkaTopics.NOTIFICATION_OTP_EMAIL, message);
    }

    public void sendAccountCreatedEvent(AccountCreatedEvent message) {
        String topic = getTopicForRole(message.getRole());
        sendMessage(topic, message);
    }

    public void sendTutorRoleAssignedEvent(TutorRoleAssignedEvent message) {
        sendMessage(KafkaTopics.TUTOR_ROLE_ASSIGNED, message.getUserId(), message);
    }

    private String getTopicForRole(String role) {
        if (role == null) {
            return KafkaTopics.ACCOUNT_CREATED;
        }
        return switch (role.toUpperCase()) {
            case "TUTOR" -> KafkaTopics.TUTOR_ACCOUNT_CREATED;
            case "STUDENT" -> KafkaTopics.STUDENT_ACCOUNT_CREATED;
            default -> KafkaTopics.ACCOUNT_CREATED;
        };
    }
}
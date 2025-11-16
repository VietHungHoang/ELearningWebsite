package com.elearning.authservice.service.producer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.elearning.authservice.dto.event.EmailOtpEvent;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final String notificationOTPEmailTopic = "notifications_otp_email";

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

    public void sendToNotificationOTPEmail(EmailOtpEvent message) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(message);
            kafkaTemplate.send(notificationOTPEmailTopic, jsonMessage);
            log.info("Sent OTP email event to topic {}: {}", notificationOTPEmailTopic, jsonMessage);
        } catch (JsonProcessingException e) {
            log.error("Error converting EmailOtpEvent to JSON: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to serialize EmailOtpEvent", e);
        }
    }
}
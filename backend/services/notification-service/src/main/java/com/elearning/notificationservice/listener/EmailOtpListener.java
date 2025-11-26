package com.elearning.notificationservice.listener;

import com.elearning.notificationservice.dto.event.EmailOtpEvent;
import com.elearning.notificationservice.service.EmailService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmailOtpListener {

    private final EmailService emailService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "notifications_otp_email", groupId = "notification-service-group")
    public void handleOtpEmail(String message) {
        log.info("Received raw message from Kafka: {}", message);
        try {
            // Deserialize JSON string to EmailOtpEvent object
            EmailOtpEvent event = objectMapper.readValue(message, EmailOtpEvent.class);
            log.info("Deserialized OTP email event: email={}, otp={}", event.getEmail(), event.getOtp());
            
            // Send email
            emailService.sendOTPEmail(event.getEmail(), event.getOtp());
            log.info("OTP email sent successfully to {}", event.getEmail());
        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize message: {}", e.getMessage(), e);
        } catch (Exception e) {
            log.error("Failed to send OTP email: {}", e.getMessage(), e);
        }
    }
}
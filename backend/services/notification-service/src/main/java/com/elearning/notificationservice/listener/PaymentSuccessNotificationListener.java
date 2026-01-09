package com.elearning.notificationservice.listener;

import com.elearning.notificationservice.dto.event.PaymentSuccessNotificationEvent;
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
public class PaymentSuccessNotificationListener {

    private final EmailService emailService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "payment_success_notification", groupId = "notification-service-group")
    public void handlePaymentSuccessNotification(String message) {
        log.info("Received payment success notification event: {}", message);
        try {
            PaymentSuccessNotificationEvent event = objectMapper.readValue(message, PaymentSuccessNotificationEvent.class);
            
            // Use default email if student email is not provided
            String studentEmail = event.getStudentEmail() != null && !event.getStudentEmail().isEmpty() 
                ? event.getStudentEmail() 
                : "os1271800@gmail.com";
            
            log.info("Sending payment success email to: {}", studentEmail);
            emailService.sendPaymentSuccessNotification(
                studentEmail,
                event.getStudentName() != null ? event.getStudentName() : "Học sinh",
                event.getTutorName() != null ? event.getTutorName() : "Giáo viên",
                event.getClassTitle() != null ? event.getClassTitle() : "Lớp học",
                event.getAmount(),
                event.getCurrency() != null ? event.getCurrency() : "VNĐ"
            );
            log.info("Payment success email sent successfully to {}", studentEmail);
        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize payment success notification message: {}", e.getMessage(), e);
        } catch (Exception e) {
            log.error("Failed to send payment success email: {}", e.getMessage(), e);
        }
    }
}


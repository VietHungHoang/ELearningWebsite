package com.elearning.notificationservice.listener;

import com.elearning.notificationservice.dto.event.ClassFullEvent;
import com.elearning.notificationservice.service.EmailService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Kafka listener for class notification events (e.g., class full, payment
 * pending)
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ClassNotificationListener {

    private final EmailService emailService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "class_notification", groupId = "notification-service-group")
    public void handleClassNotification(String message) {
        log.info("Received class notification from Kafka: {}", message);

        try {
            ClassFullEvent event = objectMapper.readValue(message, ClassFullEvent.class);
            log.info("Deserialized class notification event: type={}, classId={}, classTitle={}",
                    event.getEventType(), event.getClassId(), event.getClassTitle());

            if ("CLASS_FULL_PENDING_PAYMENT".equals(event.getEventType())) {
                handleClassFullPendingPayment(event);
            } else {
                log.warn("Unknown event type: {}", event.getEventType());
            }
        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize class notification message: {}", e.getMessage(), e);
        } catch (Exception e) {
            log.error("Failed to process class notification: {}", e.getMessage(), e);
        }
    }

    /**
     * Handle CLASS_FULL_PENDING_PAYMENT event:
     * - Send email to tutor about class being full
     * - Send email to each student requesting payment
     */
    private void handleClassFullPendingPayment(ClassFullEvent event) {
        log.info("Processing CLASS_FULL_PENDING_PAYMENT for class: {} ({})",
                event.getClassTitle(), event.getClassId());

        // 1. Send email to tutor
        if (event.getTutor() != null && event.getTutor().getEmail() != null) {
            try {
                emailService.sendClassFullNotificationToTutor(
                        event.getTutor().getEmail(),
                        event.getTutor().getFullName(),
                        event.getClassTitle(),
                        event.getStudents() != null ? event.getStudents().size() : 0);
                log.info("Sent class full notification to tutor: {}", event.getTutor().getEmail());
            } catch (Exception e) {
                log.error("Failed to send email to tutor {}: {}",
                        event.getTutor().getEmail(), e.getMessage(), e);
            }
        }

        // 2. Send email to each student requesting payment
        if (event.getStudents() != null) {
            for (ClassFullEvent.StudentInfo student : event.getStudents()) {
                if (student.getEmail() != null) {
                    try {
                        emailService.sendPaymentRequestToStudent(
                                student.getEmail(),
                                student.getFullName(),
                                event.getClassTitle(),
                                event.getPricePerHour(),
                                event.getTutor() != null ? event.getTutor().getFullName() : "Tutor");
                        log.info("Sent payment request to student: {}", student.getEmail());
                    } catch (Exception e) {
                        log.error("Failed to send email to student {}: {}",
                                student.getEmail(), e.getMessage(), e);
                    }
                }
            }
        }

        log.info("Completed processing CLASS_FULL_PENDING_PAYMENT for class: {}", event.getClassId());
    }
}

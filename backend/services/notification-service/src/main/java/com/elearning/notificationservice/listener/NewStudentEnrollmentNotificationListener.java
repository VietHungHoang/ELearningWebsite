package com.elearning.notificationservice.listener;

import com.elearning.notificationservice.dto.event.NewStudentEnrollmentNotificationEvent;
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
public class NewStudentEnrollmentNotificationListener {

    private final EmailService emailService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "new_student_enrollment_notification", groupId = "notification-service-group")
    public void handleNewStudentEnrollmentNotification(String message) {
        log.info("Received new student enrollment notification event: {}", message);
        try {
            NewStudentEnrollmentNotificationEvent event = objectMapper.readValue(message, NewStudentEnrollmentNotificationEvent.class);
            
            if (event.getTutorEmail() == null || event.getTutorEmail().isEmpty()) {
                log.warn("Tutor email is null or empty for tutorId: {}", event.getTutorId());
                return;
            }
            
            log.info("Sending new student enrollment email to tutor: {}", event.getTutorEmail());
            emailService.sendNewStudentEnrollmentNotification(
                event.getTutorEmail(),
                event.getTutorName() != null ? event.getTutorName() : "Giáo viên",
                event.getStudentName() != null ? event.getStudentName() : "Học sinh",
                event.getClassTitle() != null ? event.getClassTitle() : "Lớp học"
            );
            log.info("New student enrollment email sent successfully to {}", event.getTutorEmail());
        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize new student enrollment notification message: {}", e.getMessage(), e);
        } catch (Exception e) {
            log.error("Failed to send new student enrollment email: {}", e.getMessage(), e);
        }
    }
}


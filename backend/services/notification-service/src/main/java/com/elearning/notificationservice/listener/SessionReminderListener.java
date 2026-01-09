package com.elearning.notificationservice.listener;

import com.elearning.notificationservice.dto.event.SessionReminderEvent;
import com.elearning.notificationservice.service.EmailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

/**
 * Kafka listener for session reminder events
 * Sends email and notification 15 minutes before session starts
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SessionReminderListener {

    private final EmailService emailService;
    private final ObjectMapper objectMapper;

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @KafkaListener(topics = "session_reminder", groupId = "notification-service-group")
    public void handleSessionReminder(String message) {
        log.info("Received session reminder event: {}", message);

        try {
            ObjectMapper mapper = objectMapper.copy();
            mapper.registerModule(new JavaTimeModule());
            SessionReminderEvent event = mapper.readValue(message, SessionReminderEvent.class);

            log.info("Processing reminder for session {} at {}",
                    event.getSessionId(), event.getSessionStartTime());

            if (event.getStudentId() != null) {
                // This is a reminder for student
                sendStudentReminder(event);
            } else {
                // This is a reminder for tutor
                sendTutorReminder(event);
            }

        } catch (Exception e) {
            log.error("Failed to process session reminder event: {}", e.getMessage(), e);
        }
    }

    private void sendStudentReminder(SessionReminderEvent event) {
        if (event.getStudentEmail() == null) {
            log.warn("Student email is null for session {}, skipping email", event.getSessionId());
            return;
        }

        try {
            String time = event.getSessionStartTime().format(TIME_FORMATTER);
            String date = event.getSessionStartTime().format(DATE_FORMATTER);

            emailService.sendSessionReminder(
                    event.getStudentEmail(),
                    event.getStudentName(),
                    event.getClassTitle(),
                    time,
                    date,
                    event.getTutorName(),
                    event.getZoomJoinUrl(),
                    false // isForTutor = false
            );

            log.info("Sent session reminder email to student: {}", event.getStudentEmail());
        } catch (Exception e) {
            log.error("Failed to send reminder to student {}: {}",
                    event.getStudentEmail(), e.getMessage(), e);
        }
    }

    private void sendTutorReminder(SessionReminderEvent event) {
        if (event.getTutorEmail() == null) {
            log.warn("Tutor email is null for session {}, skipping email", event.getSessionId());
            return;
        }

        try {
            String time = event.getSessionStartTime().format(TIME_FORMATTER);
            String date = event.getSessionStartTime().format(DATE_FORMATTER);

            emailService.sendSessionReminder(
                    event.getTutorEmail(),
                    event.getTutorName(),
                    event.getClassTitle(),
                    time,
                    date,
                    null, // No tutor name for tutor's own reminder
                    event.getZoomJoinUrl(),
                    true // isForTutor = true
            );

            log.info("Sent session reminder email to tutor: {}", event.getTutorEmail());
        } catch (Exception e) {
            log.error("Failed to send reminder to tutor {}: {}",
                    event.getTutorEmail(), e.getMessage(), e);
        }
    }
}

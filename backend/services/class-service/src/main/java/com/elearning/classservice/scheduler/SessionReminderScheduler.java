package com.elearning.classservice.scheduler;

import com.elearning.classservice.dto.event.SessionReminderEvent;
import com.elearning.classservice.entity.ClassEnrollment;
import com.elearning.classservice.entity.Session;
import com.elearning.classservice.entity.enums.ScheduleStatus;
import com.elearning.classservice.repository.ClassEnrollmentRepository;
import com.elearning.classservice.repository.SessionRepository;
import com.elearning.classservice.service.KafkaProducerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

/**
 * Scheduled job to send session reminder notifications
 * Runs every minute, finds sessions starting in 14-15 minutes, sends reminders
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SessionReminderScheduler {

    private final SessionRepository sessionRepository;
    private final ClassEnrollmentRepository enrollmentRepository;
    private final KafkaProducerService kafkaProducerService;

    /**
     * Check for upcoming sessions every minute
     * Sends reminder for sessions starting in 14-15 minutes window
     */
    @Scheduled(fixedRate = 60000) // Every 60 seconds
    public void checkUpcomingSessions() {
        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        LocalDateTime windowStart = now.plusMinutes(14);
        LocalDateTime windowEnd = now.plusMinutes(15);

        log.debug("Checking for sessions between {} and {}", windowStart, windowEnd);

        // Find sessions in the 14-15 minute window that are still PENDING
        List<Session> upcomingSessions = sessionRepository.findByStartTimeBetweenAndStatus(
                windowStart, windowEnd, ScheduleStatus.PENDING);

        if (upcomingSessions.isEmpty()) {
            return;
        }

        log.info("Found {} sessions starting in ~15 minutes", upcomingSessions.size());

        for (Session session : upcomingSessions) {
            try {
                sendRemindersForSession(session);
            } catch (Exception e) {
                log.error("Failed to send reminder for session {}: {}", session.getId(), e.getMessage(), e);
            }
        }
    }

    private void sendRemindersForSession(Session session) {
        // Get class and tutor info
        var classEntity = session.getClassEntity();
        var tutor = session.getTutor();

        if (classEntity == null) {
            log.warn("Session {} has no class entity, skipping reminder", session.getId());
            return;
        }

        // Get enrolled students
        List<ClassEnrollment> enrollments = enrollmentRepository.findByClassEntityId(classEntity.getId());

        log.info("Sending reminders for session {} to {} students", session.getId(), enrollments.size());

        for (ClassEnrollment enrollment : enrollments) {
            var student = enrollment.getStudent();

            SessionReminderEvent event = SessionReminderEvent.builder()
                    .sessionId(session.getId())
                    .classId(classEntity.getId())
                    .classTitle(classEntity.getTitle())
                    .tutorId(tutor.getId())
                    .tutorName(tutor.getFullName())
                    .tutorEmail(tutor.getEmail())
                    .studentId(student.getId())
                    .studentName(student.getFullName())
                    .studentEmail(student.getEmail())
                    .sessionStartTime(session.getStartTime())
                    .sessionEndTime(session.getEndTime())
                    .sessionNumber(session.getSessionNumber())
                    .zoomJoinUrl(session.getZoomJoinUrl())
                    .build();

            kafkaProducerService.sendSessionReminderEvent(event);
            log.info("Sent reminder to student {} for session {}", student.getId(), session.getId());
        }

        // Also send reminder to tutor
        SessionReminderEvent tutorEvent = SessionReminderEvent.builder()
                .sessionId(session.getId())
                .classId(classEntity.getId())
                .classTitle(classEntity.getTitle())
                .tutorId(tutor.getId())
                .tutorName(tutor.getFullName())
                .tutorEmail(tutor.getEmail())
                .studentId(null) // null indicates this is for tutor
                .studentName(null)
                .studentEmail(null)
                .sessionStartTime(session.getStartTime())
                .sessionEndTime(session.getEndTime())
                .sessionNumber(session.getSessionNumber())
                .zoomJoinUrl(session.getZoomJoinUrl())
                .build();

        kafkaProducerService.sendSessionReminderEvent(tutorEvent);
        log.info("Sent reminder to tutor {} for session {}", tutor.getId(), session.getId());
    }
}

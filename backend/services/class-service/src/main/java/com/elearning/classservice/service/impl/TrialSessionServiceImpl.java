package com.elearning.classservice.service.impl;

import com.elearning.classservice.dto.request.TrialSessionRequest;
import com.elearning.classservice.entity.Session;
import com.elearning.classservice.entity.SessionParticipant;
import com.elearning.classservice.entity.TrialSessionRequestEntity;
import com.elearning.classservice.entity.User;
import com.elearning.classservice.entity.enums.AttendanceStatus;
import com.elearning.classservice.entity.enums.ScheduleStatus;
import com.elearning.classservice.repository.SessionParticipantRepository;
import com.elearning.classservice.repository.SessionRepository;
import com.elearning.classservice.repository.TrialSessionRepository;
import com.elearning.classservice.service.TrialSessionRequestService;
import com.elearning.classservice.service.KafkaProducerService;
import com.elearning.classservice.dto.TrialSessionRequestResponse;
import com.elearning.classservice.mapper.TrialSessionRequestMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TrialSessionServiceImpl implements TrialSessionRequestService {

    private final TrialSessionRepository trialSessionRepository;
    private final SessionRepository sessionRepository;
    private final SessionParticipantRepository sessionParticipantRepository;
    private final TrialSessionRequestMapper trialSessionRequestMapper;
    private final com.elearning.classservice.service.ZoomMeetingService zoomMeetingService;
    private final KafkaProducerService kafkaProducerService;

    private static final String NOTIFICATION_TOPIC = "create-notification";

    @Override
    @Transactional
    public void createTrialSessionRequest(TrialSessionRequest request) {
        log.info("Booking trial session for tutor: {} and student: {} at: {}",
                request.getTutorId(), request.getStudentId(), request.getSessionDateTime());

        TrialSessionRequestEntity trialSessionRequestEntity = TrialSessionRequestEntity.builder()
                .tutor(User.builder().id(request.getTutorId()).build())
                .student(User.builder().id(request.getStudentId()).build())
                .sessionDateTime(request.getSessionDateTime())
                .message(request.getMessage())
                .build();

        trialSessionRequestEntity = trialSessionRepository.save(trialSessionRequestEntity);

        log.info("Trial session request created successfully with ID: {}", trialSessionRequestEntity.getId());

        // Send notification to tutor via Kafka
        sendTrialRequestNotification(trialSessionRequestEntity);
    }

    /**
     * Send notification to tutor about new trial request
     */
    private void sendTrialRequestNotification(TrialSessionRequestEntity request) {
        try {
            Map<String, Object> notification = new HashMap<>();
            notification.put("userId", request.getTutor().getId());
            notification.put("type", "TRIAL_REQUEST");
            notification.put("title", "Yêu cầu học thử mới");
            notification.put("message", "Bạn có yêu cầu học thử mới vào lúc " +
                    request.getSessionDateTime().toLocalDate() + " " +
                    request.getSessionDateTime().toLocalTime());

            // Metadata for type-based routing
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("requestId", request.getId().toString());
            metadata.put("studentId", request.getStudent().getId().toString());
            metadata.put("sessionDateTime", request.getSessionDateTime().toString());
            notification.put("metadata", metadata);

            kafkaProducerService.sendMessage(NOTIFICATION_TOPIC, request.getTutor().getId().toString(), notification);
            log.info("Sent trial request notification to tutor: {}", request.getTutor().getId());
        } catch (Exception e) {
            log.error("Failed to send trial request notification: {}", e.getMessage(), e);
            // Don't throw - notification failure shouldn't fail the main transaction
        }
    }

    @Override
    @Transactional
    public void acceptTrialSessionRequest(UUID requestId) {
        log.info("Accepting trial session request with ID: {}", requestId);

        TrialSessionRequestEntity entity = trialSessionRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Trial session request not found"));

        entity.setStatus(ScheduleStatus.ACCEPTED);
        trialSessionRepository.save(entity);

        // Create the actual session
        createTrialSessionFromRequest(entity);

        log.info("Trial session request accepted successfully");
    }

    @Override
    @Transactional
    public void rejectTrialSessionRequest(UUID requestId) {
        log.info("Rejecting trial session request with ID: {}", requestId);

        TrialSessionRequestEntity entity = trialSessionRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Trial session request not found"));

        entity.setStatus(ScheduleStatus.CANCELLED);
        trialSessionRepository.save(entity);

        log.info("Trial session request rejected successfully");
    }

    private void createTrialSessionFromRequest(TrialSessionRequestEntity entity) {
        Session session = Session.builder()
                .tutor(entity.getTutor())
                .isTrial(true)
                .title("Trial Session")
                .startTime(entity.getSessionDateTime())
                .endTime(entity.getSessionDateTime().plusHours(1)) // Assuming 1 hour duration
                .status(ScheduleStatus.BOOKED)
                .build();

        session = sessionRepository.save(session);

        // Create Zoom meeting
        try {
            com.elearning.classservice.dto.zoom.response.ZoomMeetingResponse zoomMeeting = zoomMeetingService
                    .createScheduledMeeting(
                            entity.getTutor().getId(), session.getId());
            session.setZoomMeetingId(String.valueOf(zoomMeeting.getId()));
            session.setZoomJoinUrl(zoomMeeting.getJoinUrl());
            session.setZoomPassword(zoomMeeting.getPassword());
            sessionRepository.save(session);
            log.info("Zoom meeting created successfully with ID: {}", zoomMeeting.getId());
        } catch (Exception e) {
            log.error("Failed to create Zoom meeting for session {}", session.getId(), e);
            throw new com.elearning.classservice.exception.ZoomApiException(e.getMessage());
        }

        // Add student as participant (tutor is already stored in session.tutor)
        SessionParticipant studentParticipant = SessionParticipant.builder()
                .session(session)
                .student(entity.getStudent())
                .attendanceStatus(AttendanceStatus.REGISTERED)
                .isHost(false)
                .build();

        sessionParticipantRepository.save(studentParticipant);

        log.info("Trial session created with ID: {}", session.getId());
    }

    @Override
    @Transactional
    public TrialSessionRequestResponse getTrialSessionRequest(UUID tutorId, UUID studentId) {
        log.info("Fetching trial session request for tutor={} student={}", tutorId, studentId);

        return trialSessionRepository.findTopByTutorIdAndStudentIdOrderByCreatedAtDesc(tutorId, studentId)
                .map(entity -> {
                    // Check if session is expired (sessionDateTime is in UTC)
                    java.time.LocalDateTime now = java.time.LocalDateTime.now(java.time.ZoneOffset.UTC);
                    
                    if (entity.getSessionDateTime().isBefore(now) && 
                        entity.getStatus() == ScheduleStatus.PENDING) {
                        
                        log.info("Trial session request {} has expired. Updating status to CANCELLED", entity.getId());
                        entity.setStatus(ScheduleStatus.CANCELLED);
                        trialSessionRepository.save(entity);
                    }
                    
                    return trialSessionRequestMapper.toResponse(entity);
                })
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public java.util.List<TrialSessionRequestResponse> getTrialSessionRequestsByRole(String role, UUID userId) {
        log.info("Fetching trial session requests for role={} userId={}", role, userId);

        String normalizedRole = role.toLowerCase();
        List<TrialSessionRequestEntity> entities;

        if ("tutor".equals(normalizedRole)) {
            entities = trialSessionRepository.findByTutorId(userId);
        } else if ("student".equals(normalizedRole)) {
            entities = trialSessionRepository.findByStudentId(userId);
        } else {
            log.warn("Invalid role: {}", role);
            return java.util.Collections.emptyList();
        }

        return entities.stream()
                .map(trialSessionRequestMapper::toResponse)
                .collect(Collectors.toList());
    }
}
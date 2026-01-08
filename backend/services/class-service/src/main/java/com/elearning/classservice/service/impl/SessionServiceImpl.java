package com.elearning.classservice.service.impl;

import com.elearning.classservice.dto.event.SessionStartedEvent;
import com.elearning.classservice.dto.request.CheckSlotConflictsRequest;
import com.elearning.classservice.dto.response.JoinSessionResponse;
import com.elearning.classservice.dto.response.ReviewEligibilityResponse;
import com.elearning.classservice.dto.response.SlotConflictResponse;
import com.elearning.classservice.dto.response.StartSessionResponse;
import com.elearning.classservice.dto.sessions.SessionResponse;
import com.elearning.classservice.entity.ClassEnrollment;
import com.elearning.classservice.entity.Session;
import com.elearning.classservice.entity.SessionParticipant;
import com.elearning.classservice.entity.enums.AttendanceStatus;
import com.elearning.classservice.exception.SessionNotFoundException;
import com.elearning.classservice.mapper.SessionMapper;
import com.elearning.classservice.repository.ClassEnrollmentRepository;
import com.elearning.classservice.repository.SessionParticipantRepository;
import com.elearning.classservice.repository.SessionRepository;
import com.elearning.classservice.service.KafkaProducerService;
import com.elearning.classservice.service.SessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SessionServiceImpl implements SessionService {

    private final SessionRepository sessionRepository;
    private final ClassEnrollmentRepository enrollmentRepository;
    private final SessionParticipantRepository participantRepository;
    private final com.elearning.classservice.service.ZoomMeetingService zoomMeetingService;
    private final KafkaProducerService kafkaProducerService;
    private final SessionMapper sessionMapper;

    @Override
    @Transactional
    public void startSessionByTutor(UUID sessionId, UUID tutorId) {
        log.info("Tutor {} starting session {}", tutorId, sessionId);

        // Find session
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found: " + sessionId));

        // Verify tutor owns this session
        if (!session.getTutor().getId().equals(tutorId)) {
            throw new RuntimeException("Unauthorized: Tutor does not own this session");
        }

        // Check if Zoom link exists, if not create one
        if (session.getZoomJoinUrl() == null || session.getZoomJoinUrl().trim().isEmpty()) {
            log.info("Session {} has no Zoom link, creating one now", sessionId);
            
            try {
                com.elearning.classservice.dto.zoom.response.ZoomMeetingResponse zoomMeeting = 
                    zoomMeetingService.createScheduledMeeting(tutorId, sessionId);
                
                // Update session with Zoom details
                session.setZoomMeetingId(String.valueOf(zoomMeeting.getId()));
                session.setZoomPassword(zoomMeeting.getPassword());
                session.setZoomJoinUrl(zoomMeeting.getJoinUrl());
                session.setMeetingLink(zoomMeeting.getJoinUrl());
                
                log.info("Created Zoom meeting for session {}: {}", sessionId, zoomMeeting.getId());
            } catch (Exception e) {
                log.error("Failed to create Zoom meeting for session {}: {}", sessionId, e.getMessage(), e);
                throw new RuntimeException("Failed to create Zoom meeting: " + e.getMessage());
            }
        }

        // Update status from PENDING to BOOKED (started)
        session.setStatus(com.elearning.classservice.entity.enums.ScheduleStatus.BOOKED);
        sessionRepository.save(session);

        log.info("Session {} status updated to BOOKED by tutor {}", sessionId, tutorId);
    }

    @Override
    @Transactional
    public StartSessionResponse startSession(UUID sessionId, UUID tutorId) {
        log.info("Starting session {} by tutor {}", sessionId, tutorId);
        //
        // // 1. Validate session exists
        // Session session = sessionRepository.findById(sessionId)
        // .orElseThrow(() -> new SessionNotFoundException(sessionId));
        //
        // // 2. Check authorization
        // if (!session.getTutor().getId().equals(tutorId)) {
        // throw new UnauthorizedSessionAccessException(tutorId, sessionId);
        // }
        //
        // // 3. Check if Zoom meeting already exists
        // ZoomMeetingResponse zoomMeeting;
        // if (session.getZoomMeetingId() == null ||
        // session.getZoomMeetingId().isEmpty()) {
        // // Create new Zoom meeting
        // log.info("Creating new Zoom meeting for session {}", sessionId);
        // zoomMeeting = zoomMeetingService.createScheduledMeeting(tutorId, session);
        //
        // // Update session with Zoom details
        // session.setZoomMeetingId(String.valueOf(zoomMeeting.getId()));
        // session.setZoomPassword(zoomMeeting.getPassword());
        // session.setZoomJoinUrl(zoomMeeting.getJoinUrl());
        // session.setMeetingLink(zoomMeeting.getJoinUrl());
        // } else {
        // // Use existing Zoom meeting
        // log.info("Session {} already has Zoom meeting ID: {}", sessionId,
        // session.getZoomMeetingId());
        // zoomMeeting = ZoomMeetingResponse.builder()
        // .joinUrl(session.getZoomJoinUrl())
        // .startUrl(session.getMeetingLink()) // Will be fetched from Zoom if needed
        // .password(session.getZoomPassword())
        // .build();
        //
        // // Get full meeting details from Zoom
        // try {
        // zoomMeeting = zoomMeetingService.getMeetingDetails(tutorId,
        // session.getZoomMeetingId());
        // } catch (Exception e) {
        // log.warn("Could not fetch meeting details, using stored values: {}",
        // e.getMessage());
        // }
        // }
        //
        // // 4. Update session status to BOOKED (keep existing status)
        // // session.setStatus(ScheduleStatus.BOOKED);
        // sessionRepository.save(session);
        //
        // // 5. Get enrolled students
        // List<UUID> studentIds = getEnrolledStudents(session);
        //
        // // 6. Send Kafka notification event
        // sendSessionStartedEvent(session, studentIds);
        //
        // // 7. Return response
        // return StartSessionResponse.builder()
        // .sessionId(session.getId())
        // .status(session.getStatus().name())
        // .zoomJoinUrl(zoomMeeting.getJoinUrl())
        // .zoomStartUrl(zoomMeeting.getStartUrl())
        // .zoomMeetingId(String.valueOf(zoomMeeting.getId()))
        // .zoomPassword(zoomMeeting.getPassword())
        // .build();
        return null;
    }

    @Override
    public Session getSessionById(UUID sessionId) {
        return sessionRepository.findById(sessionId)
                .orElseThrow(() -> new SessionNotFoundException(sessionId));
    }

    /**
     * Get list of enrolled student IDs for a session
     */
    private List<UUID> getEnrolledStudents(Session session) {
        // If trial session, get from participants
        if (session.getIsTrial()) {
            return session.getParticipants().stream()
                    .map(participant -> participant.getStudent().getId())
                    .collect(Collectors.toList());
        }

        // If regular session, get from class enrollments
        if (session.getClassEntity() != null) {
            List<ClassEnrollment> enrollments = enrollmentRepository
                    .findByClassEntityId(session.getClassEntity().getId());
            return enrollments.stream()
                    .map(enrollment -> enrollment.getStudent().getId())
                    .collect(Collectors.toList());
        }

        return List.of();
    }

    /**
     * Send Kafka event when session starts
     */
    private void sendSessionStartedEvent(Session session, List<UUID> studentIds) {
        SessionStartedEvent event = SessionStartedEvent.builder()
                .sessionId(session.getId())
                .tutorId(session.getTutor().getId())
                .studentIds(studentIds)
                .zoomJoinUrl(session.getZoomJoinUrl())
                .startTime(session.getStartTime())
                .endTime(session.getEndTime())
                .sessionTitle(session.getTitle())
                .isTrial(session.getIsTrial())
                .build();

        kafkaProducerService.sendSessionStartedEvent(event);
        log.info("Sent session started event for session {} to {} students",
                session.getId(), studentIds.size());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionResponse> getBookedSessions(UUID tutorId, LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Getting booked sessions for tutor {} from {} to {}", tutorId, startDate, endDate);
        List<Session> sessions = sessionRepository.findByTutorIdAndStartTimeBetween(tutorId, startDate, endDate);
        return sessions.stream().map(sessionMapper::toSessionResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionResponse> getBookedSessionsForStudent(UUID studentId, LocalDateTime startDate,
            LocalDateTime endDate) {
        log.info("Getting booked sessions for student {} from {} to {}", studentId, startDate, endDate);
        List<Session> sessions = sessionRepository.findByStudentIdAndStartTimeBetween(studentId, startDate, endDate);
        return sessions.stream().map(sessionMapper::toSessionResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionResponse> getBookedSessionsForUser(UUID userId, LocalDateTime startDate, LocalDateTime endDate) {
        LocalDateTime effectiveStartDate = startDate != null ? startDate : LocalDateTime.of(2000, 1, 1, 0, 0);
        LocalDateTime effectiveEndDate = endDate != null ? endDate : LocalDateTime.now().plusDays(1);

        log.info("Getting booked sessions for user {} from {} to {}", userId, effectiveStartDate, effectiveEndDate);

        // Try to get sessions as tutor first
        List<SessionResponse> sessions = getBookedSessions(userId, effectiveStartDate, effectiveEndDate);
        if (!sessions.isEmpty()) {
            log.info("User {} is a tutor with {} sessions", userId, sessions.size());
            return sessions;
        }

        // If no sessions as tutor, get as student
        sessions = getBookedSessionsForStudent(userId, effectiveStartDate, effectiveEndDate);
        log.info("User {} is a student with {} sessions", userId, sessions.size());
        return sessions;
    }

    @Override
    public SlotConflictResponse checkSlotConflicts(UUID studentId, CheckSlotConflictsRequest request) {
        UUID tutorId = request.getTutorId();
        LocalDateTime startDate = request.getStartDate() != null ? request.getStartDate() : LocalDateTime.now();
        LocalDateTime endDate = request.getEndDate() != null ? request.getEndDate() : startDate.plusMonths(1);

        log.info("Checking slot conflicts for tutor {}, student {}, from {} to {}", tutorId, studentId, startDate,
                endDate);

        // 1. Get tutor's busy sessions (status != COMPLETED, CANCELLED)
        List<String> tutorBusySlots = getTutorBusySlots(tutorId, startDate, endDate);
        log.info("Found {} tutor busy slots", tutorBusySlots.size());

        // 2. Get student's busy sessions with OTHER tutors (if studentId provided)
        List<String> studentBusySlots = List.of();
        if (studentId != null) {
            studentBusySlots = getStudentBusySlots(studentId, tutorId, startDate, endDate);
            log.info("Found {} student busy slots", studentBusySlots.size());
        }

        return SlotConflictResponse.builder()
                .tutorBusySlots(tutorBusySlots)
                .studentBusySlots(studentBusySlots)
                .build();
    }

    /**
     * Get tutor's busy slots (sessions that are not completed or cancelled)
     */
    private List<String> getTutorBusySlots(UUID tutorId, LocalDateTime startDate, LocalDateTime endDate) {
        List<Session> sessions = sessionRepository.findByTutorIdAndStartTimeBetween(tutorId, startDate, endDate);
        return sessions.stream()
                .filter(s -> !isCompletedOrCancelled(s))
                .map(s -> s.getStartTime().toString())
                .collect(Collectors.toList());
    }

    /**
     * Get student's busy slots (sessions with OTHER tutors, not completed or
     * cancelled)
     */
    private List<String> getStudentBusySlots(UUID studentId, UUID currentTutorId, LocalDateTime startDate,
            LocalDateTime endDate) {
        List<Session> sessions = sessionRepository.findByStudentIdAndStartTimeBetween(studentId, startDate, endDate);
        return sessions.stream()
                .filter(s -> !isCompletedOrCancelled(s))
                .filter(s -> !s.getTutor().getId().equals(currentTutorId)) // Exclude current tutor's sessions
                .map(s -> s.getStartTime().toString())
                .collect(Collectors.toList());
    }

    private boolean isCompletedOrCancelled(Session session) {
        if (session.getStatus() == null)
            return false;
        String status = session.getStatus().name();
        return "COMPLETED".equals(status) || "CANCELLED".equals(status);
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewEligibilityResponse checkReviewEligibility(UUID studentId, UUID tutorId) {
        log.info("Checking review eligibility for student {} with tutor {}", studentId, tutorId);

        Long sessionCount = sessionRepository.countSessionsByStudentAndTutor(studentId, tutorId);
        boolean eligible = sessionCount != null && sessionCount > 0;

        log.info("Student {} {} eligible to review tutor {} (session count: {})",
                studentId, eligible ? "is" : "is not", tutorId, sessionCount);

        return ReviewEligibilityResponse.builder()
                .eligible(eligible)
                .sessionCount(sessionCount != null ? sessionCount : 0)
                .build();
    }

    @Override
    @Transactional
    public JoinSessionResponse joinSession(UUID sessionId, UUID studentId) {
        log.info("Student {} joining session {}", studentId, sessionId);

        // 1. Validate session exists
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new SessionNotFoundException(sessionId));

        // 2. Check if Zoom link exists, if not create one
        if (session.getZoomJoinUrl() == null || session.getZoomJoinUrl().trim().isEmpty()) {
            log.info("Session {} has no Zoom link, creating one now", sessionId);
            
            try {
                UUID tutorId = session.getTutor().getId();
                com.elearning.classservice.dto.zoom.response.ZoomMeetingResponse zoomMeeting = 
                    zoomMeetingService.createScheduledMeeting(tutorId, sessionId);
                
                // Update session with Zoom details
                session.setZoomMeetingId(String.valueOf(zoomMeeting.getId()));
                session.setZoomPassword(zoomMeeting.getPassword());
                session.setZoomJoinUrl(zoomMeeting.getJoinUrl());
                session.setMeetingLink(zoomMeeting.getJoinUrl());
                sessionRepository.save(session);
                
                log.info("Created Zoom meeting for session {}: {}", sessionId, zoomMeeting.getId());
            } catch (Exception e) {
                log.error("Failed to create Zoom meeting for session {}: {}", sessionId, e.getMessage(), e);
                throw new RuntimeException("Failed to create Zoom meeting: " + e.getMessage());
            }
        }

        // 3. Mark attendance - find or create SessionParticipant
        LocalDateTime now = LocalDateTime.now();
        SessionParticipant participant = participantRepository
                .findBySessionIdAndStudentId(sessionId, studentId)
                .orElse(null);

        if (participant == null) {
            // Create new participant if not exists
            participant = SessionParticipant.builder()
                    .session(session)
                    .student(com.elearning.classservice.entity.User.builder().id(studentId).build())
                    .attendanceStatus(AttendanceStatus.PRESENT)
                    .joinedAt(now)
                    .build();
        } else {
            // Update existing participant
            if (participant.getJoinedAt() == null) {
                participant.setJoinedAt(now);
            }
            participant.setAttendanceStatus(AttendanceStatus.PRESENT);
        }

        participantRepository.save(participant);
        log.info("Marked attendance for student {} in session {}", studentId, sessionId);

        // 3. Return success
        return JoinSessionResponse.builder()
                .status("PRESENT")
                .message("Successfully marked attendance")
                .build();
    }
}

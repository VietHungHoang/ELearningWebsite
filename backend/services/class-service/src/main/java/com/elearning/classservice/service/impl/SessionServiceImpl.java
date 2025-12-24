package com.elearning.classservice.service.impl;

import com.elearning.classservice.dto.event.SessionStartedEvent;
import com.elearning.classservice.dto.request.CheckSlotConflictsRequest;
import com.elearning.classservice.dto.response.StartSessionResponse;
import com.elearning.classservice.dto.sessions.SessionResponse;
import com.elearning.classservice.entity.ClassEnrollment;
import com.elearning.classservice.entity.Session;
import com.elearning.classservice.entity.SessionParticipant;
import com.elearning.classservice.exception.SessionNotFoundException;
import com.elearning.classservice.mapper.SessionMapper;
import com.elearning.classservice.repository.ClassEnrollmentRepository;
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
//    private final ZoomMeetingService zoomMeetingService;
    private final KafkaProducerService kafkaProducerService;
    private final SessionMapper sessionMapper;

    @Override
    @Transactional
    public StartSessionResponse startSession(UUID sessionId, UUID tutorId) {
        log.info("Starting session {} by tutor {}", sessionId, tutorId);
//
//        // 1. Validate session exists
//        Session session = sessionRepository.findById(sessionId)
//                .orElseThrow(() -> new SessionNotFoundException(sessionId));
//
//        // 2. Check authorization
//        if (!session.getTutorId().equals(tutorId)) {
//            throw new UnauthorizedSessionAccessException(tutorId, sessionId);
//        }
//
//        // 3. Check if Zoom meeting already exists
//        ZoomMeetingResponse zoomMeeting;
//        if (session.getZoomMeetingId() == null || session.getZoomMeetingId().isEmpty()) {
//            // Create new Zoom meeting
//            log.info("Creating new Zoom meeting for session {}", sessionId);
//            zoomMeeting = zoomMeetingService.createScheduledMeeting(tutorId, session);
//
//            // Update session with Zoom details
//            session.setZoomMeetingId(String.valueOf(zoomMeeting.getId()));
//            session.setZoomPassword(zoomMeeting.getPassword());
//            session.setZoomJoinUrl(zoomMeeting.getJoinUrl());
//            session.setMeetingLink(zoomMeeting.getJoinUrl());
//        } else {
//            // Use existing Zoom meeting
//            log.info("Session {} already has Zoom meeting ID: {}", sessionId, session.getZoomMeetingId());
//            zoomMeeting = ZoomMeetingResponse.builder()
//                    .joinUrl(session.getZoomJoinUrl())
//                    .startUrl(session.getMeetingLink()) // Will be fetched from Zoom if needed
//                    .password(session.getZoomPassword())
//                    .build();
//
//            // Get full meeting details from Zoom
//            try {
//                zoomMeeting = zoomMeetingService.getMeetingDetails(tutorId, session.getZoomMeetingId());
//            } catch (Exception e) {
//                log.warn("Could not fetch meeting details, using stored values: {}", e.getMessage());
//            }
//        }
//
//        // 4. Update session status to BOOKED (keep existing status)
//        // session.setStatus(ScheduleStatus.BOOKED);
//        sessionRepository.save(session);
//
//        // 5. Get enrolled students
//        List<UUID> studentIds = getEnrolledStudents(session);
//
//        // 6. Send Kafka notification event
//        sendSessionStartedEvent(session, studentIds);
//
//        // 7. Return response
//        return StartSessionResponse.builder()
//                .sessionId(session.getId())
//                .status(session.getStatus().name())
//                .zoomJoinUrl(zoomMeeting.getJoinUrl())
//                .zoomStartUrl(zoomMeeting.getStartUrl())
//                .zoomMeetingId(String.valueOf(zoomMeeting.getId()))
//                .zoomPassword(zoomMeeting.getPassword())
//                .build();
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
                    .map(SessionParticipant::getStudentId)
                    .collect(Collectors.toList());
        }
        
        // If regular session, get from class enrollments
        if (session.getClassEntity() != null) {
            List<ClassEnrollment> enrollments = enrollmentRepository
                    .findByClassEntityId(session.getClassEntity().getId());
            return enrollments.stream()
                    .map(ClassEnrollment::getStudentId)
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
                .tutorId(session.getTutorId())
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
    public List<SessionResponse> getBookedSessionsForStudent(UUID studentId, LocalDateTime startDate, LocalDateTime endDate) {
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
    public List<SessionResponse> checkSlotConflicts(CheckSlotConflictsRequest request) {
        UUID tutorId = request.getTutorId();
        List<LocalDateTime> slotDateTimes = request.getSlotDateTimes();

        log.info("Checking slot conflicts for tutor {} with {} slots", tutorId, slotDateTimes.size());

        // Find the earliest slot date
        LocalDateTime earliestSlot = slotDateTimes.stream().min(LocalDateTime::compareTo).orElse(LocalDateTime.now());

        // Get all future sessions for the tutor from the earliest slot date
        List<Session> futureSessions = sessionRepository.findByTutorIdAndStartTimeGreaterThanEqual(tutorId, earliestSlot);

        // For each slot, check if there's a conflicting session
        List<Session> conflictingSessions = slotDateTimes.stream()
                .flatMap(slotDateTime -> {
                    java.time.DayOfWeek dayOfWeek = slotDateTime.getDayOfWeek();
                    java.time.LocalTime time = slotDateTime.toLocalTime();
                    return futureSessions.stream()
                            .filter(session -> session.getStartTime().getDayOfWeek() == dayOfWeek
                                    && session.getStartTime().toLocalTime().equals(time));
                })
                .distinct() // Remove duplicates if any
                .collect(Collectors.toList());

        return conflictingSessions.stream()
                .map(sessionMapper::toSessionResponse)
                .collect(Collectors.toList());
    }
}

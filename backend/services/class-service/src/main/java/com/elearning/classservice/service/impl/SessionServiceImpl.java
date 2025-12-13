package com.elearning.classservice.service.impl;

import com.elearning.classservice.dto.event.SessionStartedEvent;
import com.elearning.classservice.dto.response.StartSessionResponse;
import com.elearning.classservice.dto.response.BookedSessionResponse;
import com.elearning.classservice.dto.zoom.ZoomMeetingResponse;
import com.elearning.classservice.entity.ClassEnrollment;
import com.elearning.classservice.entity.Session;
import com.elearning.classservice.entity.SessionParticipant;
import com.elearning.classservice.exception.SessionNotFoundException;
import com.elearning.classservice.exception.UnauthorizedSessionAccessException;
import com.elearning.classservice.repository.ClassEnrollmentRepository;
import com.elearning.classservice.repository.SessionRepository;
import com.elearning.classservice.service.KafkaProducerService;
import com.elearning.classservice.service.SessionService;
import com.elearning.classservice.service.ZoomMeetingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SessionServiceImpl implements SessionService {

    private final SessionRepository sessionRepository;
    private final ClassEnrollmentRepository enrollmentRepository;
    private final ZoomMeetingService zoomMeetingService;
    private final KafkaProducerService kafkaProducerService;

    @Override
    @Transactional
    public StartSessionResponse startSession(UUID sessionId, UUID tutorId) {
        log.info("Starting session {} by tutor {}", sessionId, tutorId);
        
        // 1. Validate session exists
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new SessionNotFoundException(sessionId));
        
        // 2. Check authorization
        if (!session.getTutorId().equals(tutorId)) {
            throw new UnauthorizedSessionAccessException(tutorId, sessionId);
        }
        
        // 3. Check if Zoom meeting already exists
        ZoomMeetingResponse zoomMeeting;
        if (session.getZoomMeetingId() == null || session.getZoomMeetingId().isEmpty()) {
            // Create new Zoom meeting
            log.info("Creating new Zoom meeting for session {}", sessionId);
            zoomMeeting = zoomMeetingService.createScheduledMeeting(tutorId, session);
            
            // Update session with Zoom details
            session.setZoomMeetingId(String.valueOf(zoomMeeting.getId()));
            session.setZoomPassword(zoomMeeting.getPassword());
            session.setZoomJoinUrl(zoomMeeting.getJoinUrl());
            session.setMeetingLink(zoomMeeting.getJoinUrl());
        } else {
            // Use existing Zoom meeting
            log.info("Session {} already has Zoom meeting ID: {}", sessionId, session.getZoomMeetingId());
            zoomMeeting = ZoomMeetingResponse.builder()
                    .joinUrl(session.getZoomJoinUrl())
                    .startUrl(session.getMeetingLink()) // Will be fetched from Zoom if needed
                    .password(session.getZoomPassword())
                    .build();
            
            // Get full meeting details from Zoom
            try {
                zoomMeeting = zoomMeetingService.getMeetingDetails(tutorId, session.getZoomMeetingId());
            } catch (Exception e) {
                log.warn("Could not fetch meeting details, using stored values: {}", e.getMessage());
            }
        }
        
        // 4. Update session status to BOOKED (keep existing status)
        // session.setStatus(ScheduleStatus.BOOKED);
        sessionRepository.save(session);
        
        // 5. Get enrolled students
        List<UUID> studentIds = getEnrolledStudents(session);
        
        // 6. Send Kafka notification event
        sendSessionStartedEvent(session, studentIds);
        
        // 7. Return response
        return StartSessionResponse.builder()
                .sessionId(session.getId())
                .status(session.getStatus().name())
                .zoomJoinUrl(zoomMeeting.getJoinUrl())
                .zoomStartUrl(zoomMeeting.getStartUrl())
                .zoomMeetingId(String.valueOf(zoomMeeting.getId()))
                .zoomPassword(zoomMeeting.getPassword())
                .build();
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
    public List<BookedSessionResponse> getBookedSessions(UUID tutorId, LocalDate startDate, LocalDate endDate) {
        log.info("Getting booked sessions for tutor {} from {} to {}", tutorId, startDate, endDate);
        
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);
        
        List<Session> sessions = sessionRepository.findByTutorIdAndStartTimeBetween(tutorId, startDateTime, endDateTime);
        
        // Map sessions to response DTOs
        List<BookedSessionResponse> responses = new ArrayList<>();
        for (Session session : sessions) {
            // Get all participants
            List<UUID> studentIds = session.getParticipants().stream()
                    .map(SessionParticipant::getStudentId)
                    .collect(Collectors.toList());

            LocalDateTime bookedAt = null;
            if (!session.getParticipants().isEmpty()) {
                bookedAt = session.getParticipants().get(0).getCreatedAt();
            }

            // Determine session type
            String sessionType;
            if (session.getIsTrial()) {
                sessionType = "Trial";
            } else if (session.getClassEntity() != null) {
                sessionType = session.getClassEntity().getClassType().name().equals("ONE_ON_ONE") ? "1-on-1" : "Group";
            } else {
                sessionType = "1-on-1"; // Default
            }

            // Get class name
            String className = null;
            if (session.getClassEntity() != null) {
                className = session.getClassEntity().getTitle();
            }

            BookedSessionResponse response = BookedSessionResponse.builder()
                    .id(session.getId().toString())
                    .studentIds(studentIds)
                    .sessionDatetime(session.getStartTime().toString())
                    .className(className)
                    .sessionType(sessionType)
                    .createdAt(bookedAt != null ? bookedAt.toString() : null)
                    .updatedAt(session.getUpdatedAt().toString())
                    .meetingUrl(session.getZoomJoinUrl())
                    .notes(session.getNotes())
                    .build();

            responses.add(response);
        }        log.info("Found {} booked sessions for tutor {}", responses.size(), tutorId);
        return responses;
    }
}




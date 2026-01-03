package com.elearning.classservice.service.impl;

import com.elearning.classservice.dto.request.RescheduleRequestRequest;
import com.elearning.classservice.dto.response.RescheduleRequestResponse;
import com.elearning.classservice.entity.RescheduleRequest;
import com.elearning.classservice.entity.Session;
import com.elearning.classservice.entity.SessionParticipant;
import com.elearning.classservice.entity.User;
import com.elearning.classservice.entity.enums.RequestTargetType;
import com.elearning.classservice.entity.enums.RequestStatus;
import com.elearning.classservice.exception.SessionNotFoundException;
import com.elearning.classservice.exception.UserNotParticipantException;
import com.elearning.classservice.repository.RescheduleRequestRepository;
import com.elearning.classservice.repository.SessionRepository;
import com.elearning.classservice.service.RescheduleRequestService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RescheduleRequestServiceImpl implements RescheduleRequestService {

    private final SessionRepository sessionRepository;
    private final RescheduleRequestRepository rescheduleRequestRepository;

    @Override
    @Transactional
    public void createForSession(UUID sessionId, UUID requesterId, RescheduleRequestRequest dto) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new SessionNotFoundException(sessionId));

        boolean isParticipant = session.getParticipants().stream()
                .map(SessionParticipant::getStudent)
                .map(User::getId)
                .anyMatch(id -> id.equals(requesterId));

        if (!isParticipant) {
            log.warn("User {} is not a participant of session {}", requesterId, sessionId);
            throw new UserNotParticipantException(requesterId, sessionId);
        }

        LocalDateTime oldSchedule = null;
        LocalDateTime newSchedule = null;
        try {
            if (dto.getOldSchedule() != null) {
                oldSchedule = LocalDateTime.ofInstant(Instant.parse(dto.getOldSchedule()), ZoneOffset.UTC);
            }
            if (dto.getNewSchedule() != null) {
                newSchedule = LocalDateTime.ofInstant(Instant.parse(dto.getNewSchedule()), ZoneOffset.UTC);
            }
        } catch (Exception ex) {
            log.error("Failed to parse schedule times", ex);
            throw new IllegalArgumentException("Invalid schedule date format. Use ISO-8601 UTC format.");
        }

        RescheduleRequest request = RescheduleRequest.builder()
                .session(session)
                .classEntity(session.getClassEntity())
                .targetType(RequestTargetType.SESSION)
                .requester(session.getParticipants().stream()
                        .filter(p -> p.getStudent().getId().equals(requesterId)).findFirst().get().getStudent())
                .oldSchedule(oldSchedule)
                .newSchedule(newSchedule)
                .reason(dto.getReason())
                .status(RequestStatus.PENDING)
                .build();

        rescheduleRequestRepository.save(request);
        log.info("Reschedule request saved for session {} by user {}", sessionId, requesterId);
    }

    @Override
    public List<RescheduleRequestResponse> getRequestsByUser(UUID userId, String userType) {
        List<RescheduleRequest> requests;
        if ("student".equalsIgnoreCase(userType)) {
            requests = rescheduleRequestRepository.findByRequesterId(userId);
        } else if ("tutor".equalsIgnoreCase(userType)) {
            List<RescheduleRequest> sessionRequests = rescheduleRequestRepository.findBySessionTutorId(userId);
            List<RescheduleRequest> classRequests = rescheduleRequestRepository.findByClassTutorId(userId);
            sessionRequests.addAll(classRequests);
            requests = sessionRequests;
        } else {
            throw new IllegalArgumentException("Invalid userType. Must be 'student' or 'tutor'");
        }
        return requests.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void acceptRequest(UUID requestId, UUID userId) {
        RescheduleRequest request = rescheduleRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new IllegalArgumentException("Request is not pending");
        }

        // Check if user is the tutor of the session
        if (request.getTargetType() == RequestTargetType.SESSION) {
            if (!request.getSession().getTutor().getId().equals(userId)) {
                throw new IllegalArgumentException("Only the session tutor can accept this request");
            }
            // Update session schedule
            if (request.getNewSchedule() != null) {
                request.getSession().setStartTime(request.getNewSchedule());
                // Assuming duration stays the same, but for simplicity, not updating endTime
            }
        } else {
            // For class, similar logic if needed
            throw new UnsupportedOperationException("Class reschedule not implemented yet");
        }

        request.setStatus(RequestStatus.APPROVED);
        rescheduleRequestRepository.save(request);
        log.info("Reschedule request {} accepted by user {}", requestId, userId);
    }

    @Override
    @Transactional
    public void rejectRequest(UUID requestId, UUID userId) {
        RescheduleRequest request = rescheduleRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new IllegalArgumentException("Request is not pending");
        }

        // Check if user is the tutor
        if (request.getTargetType() == RequestTargetType.SESSION) {
            if (!request.getSession().getTutor().getId().equals(userId)) {
                throw new IllegalArgumentException("Only the session tutor can reject this request");
            }
        } else {
            throw new UnsupportedOperationException("Class reschedule not implemented yet");
        }

        request.setStatus(RequestStatus.REJECTED);
        rescheduleRequestRepository.save(request);
        log.info("Reschedule request {} rejected by user {}", requestId, userId);
    }

    private RescheduleRequestResponse mapToResponse(RescheduleRequest request) {
        return RescheduleRequestResponse.builder()
                .id(request.getId())
                .sessionId(request.getSession() != null ? request.getSession().getId() : null)
                .classId(request.getClassEntity() != null ? request.getClassEntity().getId() : null)
                .targetType(request.getTargetType())
                .requesterId(request.getRequester().getId())
                .requesterName(request.getRequester().getFullName())
                .oldSchedule(request.getOldSchedule())
                .newSchedule(request.getNewSchedule())
                .reason(request.getReason())
                .status(request.getStatus())
                .createdAt(request.getCreatedAt())
                .build();
    }
}

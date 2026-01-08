package com.elearning.classservice.service.impl;

import com.elearning.classservice.dto.zoom.response.ZoomMeetingResponse;
import com.elearning.classservice.entity.ClassEntity;
import com.elearning.classservice.entity.Session;
import com.elearning.classservice.repository.ClassRepository;
import com.elearning.classservice.repository.SessionRepository;
import com.elearning.classservice.service.ZoomAsyncService;
import com.elearning.classservice.service.ZoomMeetingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ZoomAsyncServiceImpl implements ZoomAsyncService {

    private final ClassRepository classRepository;
    private final SessionRepository sessionRepository;
    private final ZoomMeetingService zoomMeetingService;

    @Override
    @Async
    @Transactional
    public void createZoomMeetingsForClassAsync(UUID classId) {
        log.info("[ASYNC] Starting Zoom meeting creation for class {}", classId);

        try {
            // Find class
            ClassEntity classEntity = classRepository.findById(classId)
                    .orElseThrow(() -> new RuntimeException("Class not found: " + classId));

            // Get all sessions for this class
            List<Session> sessions = sessionRepository.findByClassEntityIdOrderByStartTimeAsc(classId);

            if (sessions.isEmpty()) {
                log.warn("[ASYNC] No sessions found for class {}", classId);
                return;
            }

            UUID tutorId = classEntity.getTutor().getId();
            int successCount = 0;
            int failCount = 0;

            for (Session session : sessions) {
                try {
                    // Skip if Zoom meeting already exists
                    if (session.getZoomMeetingId() != null && !session.getZoomMeetingId().isEmpty()) {
                        log.info("[ASYNC] Session {} already has Zoom meeting ID: {}", session.getId(),
                                session.getZoomMeetingId());
                        continue;
                    }

                    // Create Zoom meeting
                    ZoomMeetingResponse zoomMeeting = zoomMeetingService.createScheduledMeeting(tutorId,
                            session.getId());

                    // Update session with Zoom details
                    session.setZoomMeetingId(String.valueOf(zoomMeeting.getId()));
                    session.setZoomPassword(zoomMeeting.getPassword());
                    session.setZoomJoinUrl(zoomMeeting.getJoinUrl());
                    session.setMeetingLink(zoomMeeting.getJoinUrl());

                    sessionRepository.save(session);

                    successCount++;
                    log.info("[ASYNC] Created Zoom meeting for session {}: {}", session.getId(), zoomMeeting.getId());

                } catch (Exception e) {
                    failCount++;
                    log.error("[ASYNC] Failed to create Zoom meeting for session {}: {}", session.getId(), 
                            e.getMessage(), e);
                    // Continue with next session even if one fails
                }
            }

            log.info("[ASYNC] Zoom meeting creation completed for class {}. Success: {}, Failed: {}",
                    classId, successCount, failCount);

        } catch (Exception e) {
            log.error("[ASYNC] Error creating Zoom meetings for class {}: {}", classId, e.getMessage(), e);
        }
    }
}

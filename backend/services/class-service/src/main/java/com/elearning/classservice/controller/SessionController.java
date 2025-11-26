package com.elearning.classservice.controller;

import com.elearning.classservice.dto.response.BookedSessionResponse;
import com.elearning.classservice.dto.response.StartSessionResponse;
import com.elearning.classservice.entity.Session;
import com.elearning.classservice.entity.enums.ScheduleStatus;
import com.elearning.classservice.service.SessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Controller for session management
 */
@RestController
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
@Slf4j
public class SessionController {

    private final SessionService sessionService;

    /**
     * POST /api/v1/sessions/{sessionId}/start?tutorId={tutorId}
     * Start a session - creates Zoom meeting if doesn't exist
     * 
     * @param sessionId session ID
     * @param tutorId tutor ID (for authorization)
     * @return session details with Zoom URLs
     */
    @PostMapping("/{sessionId}/start")
    public ResponseEntity<StartSessionResponse> startSession(
            @PathVariable UUID sessionId,
            @RequestParam UUID tutorId) {
        
        log.info("Request to start session {} by tutor {}", sessionId, tutorId);
        
        StartSessionResponse response = sessionService.startSession(sessionId, tutorId);
        
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/sessions/{sessionId}
     * Get session details
     * 
     * @param sessionId session ID
     * @return session details
     */
    @GetMapping("/{sessionId}")
    public ResponseEntity<Session> getSession(@PathVariable UUID sessionId) {
        log.info("Request to get session {}", sessionId);
        
        Session session = sessionService.getSessionById(sessionId);
        
        return ResponseEntity.ok(session);
    }

    /**
     * GET /api/v1/sessions/booked?tutorId={tutorId}&startDate={startDate}&endDate={endDate}&statuses={statuses}
     * Get booked sessions for a tutor in a date range
     * 
     * @param tutorId tutor ID
     * @param startDate start date (inclusive)
     * @param endDate end date (inclusive)
     * @param statuses optional list of statuses to filter by (PENDING, BOOKED, CANCELLED)
     * @return list of booked sessions
     */
    @GetMapping("/booked")
    public ResponseEntity<List<BookedSessionResponse>> getBookedSessions(
            @RequestParam UUID tutorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) List<ScheduleStatus> statuses) {
        
        log.info("Request to get booked sessions for tutor {} from {} to {} with statuses {}", 
                tutorId, startDate, endDate, statuses);
        
        List<BookedSessionResponse> sessions = sessionService.getBookedSessions(tutorId, startDate, endDate, statuses);
        
        return ResponseEntity.ok(sessions);
    }
}

package com.elearning.classservice.service;

import com.elearning.classservice.dto.response.StartSessionResponse;
import com.elearning.classservice.dto.response.BookedSessionResponse;
import com.elearning.classservice.entity.Session;
import com.elearning.classservice.entity.enums.ScheduleStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Service for managing class sessions
 */
public interface SessionService {
    
    /**
     * Start a session - creates Zoom meeting if not exists and updates status to ONGOING
     * @param sessionId session ID 
     * @param tutorId tutor ID (for authorization)
     * @return session details with Zoom URLs
     */
    StartSessionResponse startSession(UUID sessionId, UUID tutorId);
    
    /**
     * Get session details
     * @param sessionId session ID
     * @return session info
     */
    Session getSessionById(UUID sessionId);
    
    /**
     * Get booked sessions for a tutor
     * @param tutorId tutor ID
     * @param startDate start date
     * @param endDate end date
     * @param statuses filter by statuses (optional)
     * @return list of booked sessions
     */
    List<BookedSessionResponse> getBookedSessions(UUID tutorId, LocalDate startDate, LocalDate endDate, List<ScheduleStatus> statuses);
}

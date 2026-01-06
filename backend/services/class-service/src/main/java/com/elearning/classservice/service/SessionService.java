package com.elearning.classservice.service;

import com.elearning.classservice.dto.request.CheckSlotConflictsRequest;
import com.elearning.classservice.dto.response.SlotConflictResponse;
import com.elearning.classservice.dto.response.StartSessionResponse;
import com.elearning.classservice.dto.sessions.SessionResponse;
import com.elearning.classservice.entity.Session;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface SessionService {

    StartSessionResponse startSession(UUID sessionId, UUID tutorId);

    Session getSessionById(UUID sessionId);

    List<SessionResponse> getBookedSessions(UUID tutorId, LocalDateTime startDate, LocalDateTime endDate);

    List<SessionResponse> getBookedSessionsForStudent(UUID studentId, LocalDateTime startDate, LocalDateTime endDate);

    List<SessionResponse> getBookedSessionsForUser(UUID userId, LocalDateTime startDate, LocalDateTime endDate);

    SlotConflictResponse checkSlotConflicts(UUID studentId, CheckSlotConflictsRequest request);
}

package com.elearning.classservice.service;

import com.elearning.classservice.dto.response.StartSessionResponse;
import com.elearning.classservice.dto.response.BookedSessionResponse;
import com.elearning.classservice.entity.Session;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface SessionService {
    
    StartSessionResponse startSession(UUID sessionId, UUID tutorId);
    
    Session getSessionById(UUID sessionId);

    List<BookedSessionResponse> getBookedSessions(UUID tutorId, LocalDate startDate, LocalDate endDate);
}



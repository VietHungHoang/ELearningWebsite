package com.elearning.bffservice.service;

import com.elearning.bffservice.dto.clas.request.TrialSessionRequest;
import com.elearning.bffservice.dto.clas.request.ZoomOAuthCallbackRequest;
import com.elearning.bffservice.dto.clas.response.ZoomAuthorizationUrlResponse;
import com.elearning.bffservice.bff.clas.response.TrialSessionRequestBffResponse;
import com.elearning.bffservice.dto.clas.response.TrialSessionRequestResponse;
import com.elearning.bffservice.dto.response.BookedSessionsData;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface ClassService {

    /**
     * Save a trial session request for a student with a tutor
     * @param request Trial session booking request
     */
    void saveTrialSessionRequest(TrialSessionRequest request);

    /**
     * Get Zoom authorization URL for tutor
     * @param tutorId the tutor ID
     * @return ZoomAuthorizationUrlResponse
     */
    ZoomAuthorizationUrlResponse getZoomAuthorizationUrl(UUID tutorId);

    /**
     * Handle Zoom OAuth callback
     * @param request the callback request
     */
    void handleZoomOAuthCallback(ZoomOAuthCallbackRequest request);

    /**
     * Get trial session request for a tutor and student
     * @param tutorId the tutor ID
     * @param studentId the student ID
     * @return TrialSessionRequestResponse
     */
    TrialSessionRequestResponse getTrialSessionRequest(UUID tutorId, UUID studentId);

    /**
     * Get list of trial session requests by role and user ID
     * @param role the role (tutor/student)
     * @param userId the user ID
     * @return List of TrialSessionRequestBffResponse
     */
    List<TrialSessionRequestBffResponse> getTrialSessionRequestsByRole(String role, UUID userId);

    /**
     * Accept a trial session request
     * @param requestId the request ID to accept
     */
    void acceptTrialSessionRequest(UUID requestId);

    /**
     * Get booked sessions with students for a tutor
     * @param tutorId the tutor ID
     * @param startDate the start date
     * @param endDate the end date
     * @return BookedSessionsData
     */
    BookedSessionsData getBookedSessionsWithStudents(UUID tutorId, LocalDate startDate, LocalDate endDate);
}
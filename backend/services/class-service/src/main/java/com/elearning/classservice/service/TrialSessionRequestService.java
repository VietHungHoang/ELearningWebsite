package com.elearning.classservice.service;

import com.elearning.classservice.dto.request.TrialSessionRequest;
import com.elearning.classservice.dto.TrialSessionRequestResponse;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface TrialSessionRequestService {

    /**
     * Book a trial session for a student with a tutor
     * @param request Trial session booking request
     */
    void createTrialSessionRequest(TrialSessionRequest request);

    /**
     * Accept a trial session request
     * @param requestId The ID of the trial session request to accept
     */
    void acceptTrialSessionRequest(UUID requestId);

    /**
     * Get trial session request for a tutor and student (latest record)
     * @param tutorId tutor id
     * @param studentId student id
     * @return DTO of trial session request or null if not found
     */
    TrialSessionRequestResponse getTrialSessionRequest(UUID tutorId, UUID studentId);
    
    /**
     * Get list of trial session requests by role and user ID with PENDING status
     * @param role "tutor" or "student" (case insensitive)
     * @param userId user ID
     * @return list of trial session request DTOs
     */
    java.util.List<TrialSessionRequestResponse> getTrialSessionRequestsByRole(String role, UUID userId);
}
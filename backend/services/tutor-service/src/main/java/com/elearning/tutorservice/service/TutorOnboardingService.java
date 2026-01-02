package com.elearning.tutorservice.service;

import com.elearning.tutorservice.dto.event.AccountCreatedEvent;
import com.elearning.tutorservice.dto.request.UpdateOnboardingRequest;
import com.elearning.tutorservice.dto.response.OnboardingResponse;
import com.elearning.tutorservice.dto.response.PendingTutorResponse;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface TutorOnboardingService {

    OnboardingResponse getOnboarding(UUID tutorId);

    void updateOnboarding(UUID tutorId, UpdateOnboardingRequest request);

    void createTutorOnboarding(AccountCreatedEvent event);

    void approveTutor(UUID tutorId);

    void processResumeSubmission(UUID tutorId, String resumeText);

    /**
     * Generate introduction for tutor based on prompt and onboarding data
     * @param tutorId Tutor ID
     * @param prompt User prompt for generating introduction
     * @return Generated introduction text
     */
    String generateIntroduction(UUID tutorId, String prompt);

    /**
     * Get all pending tutor onboarding requests
     * @param page Page number (0-based)
     * @param size Page size
     * @return Page of pending tutor requests
     */
    Page<PendingTutorResponse> getPendingRequests(int page, int size);

}


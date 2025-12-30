package com.elearning.tutorservice.service;

import com.elearning.tutorservice.dto.event.AccountCreatedEvent;
import com.elearning.tutorservice.dto.request.UpdateOnboardingRequest;
import com.elearning.tutorservice.dto.response.OnboardingResponse;

import java.util.UUID;

public interface TutorOnboardingService {

    OnboardingResponse getOnboarding(UUID tutorId);

    void updateOnboarding(UUID tutorId, UpdateOnboardingRequest request);

    void createTutorOnboarding(AccountCreatedEvent event);

    void approveTutor(UUID tutorId);

    void processResumeSubmission(UUID tutorId, String resumeText);

}


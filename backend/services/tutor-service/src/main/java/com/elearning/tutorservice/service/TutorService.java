package com.elearning.tutorservice.service;

import com.elearning.tutorservice.dto.request.BulkUpdateAvailabilityRequest;
import com.elearning.tutorservice.dto.request.SubmitReviewRequest;
import com.elearning.tutorservice.dto.request.UpdateOnboardingStatusRequest;
import com.elearning.tutorservice.dto.response.*;
import com.elearning.tutorservice.dto.event.AccountCreatedEvent;
import com.elearning.tutorservice.dto.event.TutorProfileUpdatedEvent;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface TutorService {
    void approveTutor(UUID tutorId);

    TutorDetailResponse getTutorDetail(UUID tutorId);

    Map<UUID, TutorResponse> getTutorsByIds(List<UUID> ids);

    void updateOnboardingStatus(UUID tutorId, UpdateOnboardingStatusRequest request);

    void updateTutorProfile(TutorProfileUpdatedEvent event);

    AvailabilityListResponse getAvailabilities(UUID tutorId, LocalDate startDate, LocalDate endDate);

    void createTutorOnboarding(AccountCreatedEvent event);

    void submitReview(UUID tutorId, SubmitReviewRequest request);
}
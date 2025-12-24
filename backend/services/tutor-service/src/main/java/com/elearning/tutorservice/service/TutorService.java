package com.elearning.tutorservice.service;

import com.elearning.tutorservice.dto.request.SubmitReviewRequest;
import com.elearning.tutorservice.dto.request.UpdateOnboardingStatusRequest;
import com.elearning.tutorservice.dto.response.*;
import com.elearning.tutorservice.dto.event.AccountCreatedEvent;
import com.elearning.tutorservice.dto.event.TutorProfileUpdatedEvent;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface TutorService {
    TutorResponse getTutorById(UUID tutorId);

    List<TutorResponse> getTutorsByIds(List<UUID> ids);

    void submitReview(UUID tutorId, SubmitReviewRequest request);
}
package com.elearning.tutorservice.service;

import com.elearning.tutorservice.dto.request.SubmitReviewRequest;
import com.elearning.tutorservice.dto.request.UpdateOnboardingStatusRequest;
import com.elearning.tutorservice.dto.request.UpdateTutorProfileRequest;
import com.elearning.tutorservice.dto.response.*;
import com.elearning.tutorservice.dto.event.AccountCreatedEvent;
import com.elearning.tutorservice.dto.event.TutorProfileUpdatedEvent;
import org.springframework.data.domain.Page;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface TutorService {
    TutorResponse getTutorById(UUID tutorId);

    List<TutorResponse> getTutorsByIds(List<UUID> ids);

    List<TutorResponse> getSimilarTutors(UUID tutorId, List<UUID> subjectIds);

    void submitReview(UUID tutorId, SubmitReviewRequest request);
    
    TutorResponse updateTutorProfile(UUID tutorId, UpdateTutorProfileRequest request);
    
    void incrementTotalStudents(String tutorId);
    
    void handleNewStudentEnrollment(String tutorId, String studentId);

    /**
     * Get all verified tutors with pagination
     * @param page Page number (1-based)
     * @param size Page size
     * @return Page of verified tutors
     */
    Page<TutorResponse> getAllTutors(int page, int size);
}
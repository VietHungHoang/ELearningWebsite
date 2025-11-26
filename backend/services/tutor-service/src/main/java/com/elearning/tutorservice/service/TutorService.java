package com.elearning.tutorservice.service;

import com.elearning.tutorservice.dto.request.BulkUpdateAvailabilityRequest;
import com.elearning.tutorservice.dto.response.AvailabilityResponse;
import com.elearning.tutorservice.dto.response.TutorProfileResponse;
import com.elearning.tutorservice.dto.response.TutorScheduleResponse;
import com.elearning.tutorservice.dto.response.TutorSearchResponse;
import com.elearning.tutorservice.dto.event.TutorProfileUpdatedEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface TutorService {
    Page<TutorSearchResponse> searchTutors(List<String> languageCodes, BigDecimal minPrice, BigDecimal maxPrice, List<String> availableDays, Pageable pageable);
    List<TutorScheduleResponse> getTutorSchedule(Long tutorId, boolean includeBooked);
    TutorProfileResponse getTutorProfile(UUID tutorId);
    void updateTutorProfile(TutorProfileUpdatedEvent event);
    List<AvailabilityResponse> getAvailabilities(UUID tutorId, LocalDate startDate, LocalDate endDate);
    void bulkUpdateAvailability(UUID tutorId, BulkUpdateAvailabilityRequest request);
}
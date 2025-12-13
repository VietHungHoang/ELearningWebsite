package com.elearning.tutorservice.service;

import com.elearning.tutorservice.dto.request.UpdateAvailabilityScheduleRequest;
import com.elearning.tutorservice.dto.response.AvailabilityListResponse;

import java.time.LocalDate;
import java.util.UUID;

public interface AvailabilityService {
    AvailabilityListResponse getAvailabilities(UUID tutorId, LocalDate startDate, LocalDate endDate);
    void updateAvailabilitySchedule(UUID tutorId, UpdateAvailabilityScheduleRequest request);
}
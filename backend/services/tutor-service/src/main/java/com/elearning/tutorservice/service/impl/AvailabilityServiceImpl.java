package com.elearning.tutorservice.service.impl;

import com.elearning.tutorservice.dto.request.UpdateAvailabilityScheduleRequest;
import com.elearning.tutorservice.dto.response.AvailabilityListResponse;
import com.elearning.tutorservice.dto.response.AvailabilityResponse;
import com.elearning.tutorservice.entity.Tutor;
import com.elearning.tutorservice.entity.TutorAvailability;
import com.elearning.tutorservice.mapper.TutorMapper;
import com.elearning.tutorservice.repository.TutorAvailabilityRepository;
import com.elearning.tutorservice.repository.TutorRepository;
import com.elearning.tutorservice.service.AvailabilityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AvailabilityServiceImpl implements AvailabilityService {

    private final TutorAvailabilityRepository availabilityRepository;
    private final TutorRepository tutorRepository;
    private final TutorMapper tutorMapper;

    @Override
    public AvailabilityListResponse getAvailabilities(UUID tutorId, LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Start date and end date are required");
        }
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date must be before or equal to end date");
        }

        log.info("Getting availabilities for tutor {} from {} to {}", tutorId, startDate, endDate);

        List<TutorAvailability> availabilities = availabilityRepository.findByTutorIdAndDateRange(
                tutorId, startDate, endDate);

        List<AvailabilityResponse> responses = availabilities.stream()
                .map(tutorMapper::toAvailabilityResponse)
                .collect(Collectors.toList());

        return AvailabilityListResponse.builder()
                .availabilities(responses)
                .build();
    }

    @Override
    @Transactional
    public void updateAvailabilitySchedule(UUID tutorId, UpdateAvailabilityScheduleRequest request) {
        Tutor tutor = tutorRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Tutor not found"));

        // End all existing availabilities by setting effectiveEndDate to yesterday
        // Get all current/future availabilities (effectiveEndDate >= today or null)
        LocalDate today = LocalDate.now();
        List<TutorAvailability> existingAvailabilities = availabilityRepository.findByTutorIdAndDateRange(
                tutorId, today, LocalDate.of(2100, 12, 31));
        if (!existingAvailabilities.isEmpty()) {
            existingAvailabilities.forEach(availability -> availability.setEffectiveEndDate(today.minusDays(1)));
            availabilityRepository.saveAll(existingAvailabilities);
            log.info("Ended {} existing availabilities for tutor {}", existingAvailabilities.size(), tutorId);
        }

        // Create new availabilities from the input list
        List<TutorAvailability> newAvailabilities = request.getAvailabilities().stream()
                .map(availabilityInput -> TutorAvailability.builder()
                        .tutor(tutor)
                        .dayOfWeek(availabilityInput.getDayOfWeek().shortValue())
                        .startTime(LocalTime.parse(availabilityInput.getStartTime()))
                        .endTime(LocalTime.parse(availabilityInput.getEndTime()))
                        .effectiveStartDate(availabilityInput.getEffectiveStartDate())
                        .build())
                .collect(Collectors.toList());

        availabilityRepository.saveAll(newAvailabilities);
        
        log.info("Updated availability schedule for tutor {} with {} new slots", tutorId, newAvailabilities.size());
    }
}
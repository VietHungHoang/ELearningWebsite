package com.elearning.tutorservice.controller;

import com.elearning.tutorservice.dto.request.UpdateAvailabilityScheduleRequest;
import com.elearning.tutorservice.dto.response.ApiResponse;
import com.elearning.tutorservice.dto.response.AvailabilityListResponse;
import com.elearning.tutorservice.service.AvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/tutors")
@RequiredArgsConstructor
public class ScheduleController {

    private final AvailabilityService availabilityService;

    @GetMapping("/{id}/availabilities")
    public ResponseEntity<ApiResponse<AvailabilityListResponse>> getTutorAvailabilities(
            @PathVariable UUID id,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        
        AvailabilityListResponse availabilities = availabilityService.getAvailabilities(id, startDate, endDate);
        
        return ResponseEntity.ok(ApiResponse.success(availabilities, "Tutor availabilities retrieved successfully"));
    }

    @PutMapping("/{id}/availabilities")
    public ResponseEntity<ApiResponse<Void>> updateTutorAvailabilities(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateAvailabilityScheduleRequest request) {
        
        availabilityService.updateAvailabilitySchedule(id, request);
        
        return ResponseEntity.ok(ApiResponse.success(null, "Tutor availabilities updated successfully"));
    }
}
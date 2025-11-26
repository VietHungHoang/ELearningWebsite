package com.elearning.tutorservice.controller;

import com.elearning.tutorservice.dto.request.BulkUpdateAvailabilityRequest;
import com.elearning.tutorservice.dto.response.AvailabilityResponse;
import com.elearning.tutorservice.dto.response.TutorScheduleResponse;
import com.elearning.tutorservice.dto.response.TutorSearchResponse;
import com.elearning.tutorservice.dto.response.TutorProfileResponse;
import com.elearning.tutorservice.service.TutorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/tutors")
@RequiredArgsConstructor
public class TutorController {

    private final TutorService tutorService;

    @GetMapping("/search")
    public ResponseEntity<Page<TutorSearchResponse>> searchTutors(
            @RequestParam(required = false) List<String> languageCodes,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) List<String> availableDays,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<TutorSearchResponse> results = tutorService.searchTutors(languageCodes, minPrice, maxPrice, availableDays, pageable);

        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}/schedule")
    public ResponseEntity<List<TutorScheduleResponse>> getTutorSchedule(@PathVariable Long id, @RequestParam(defaultValue = "false") boolean includeBooked) {
        List<TutorScheduleResponse> schedule = tutorService.getTutorSchedule(id, includeBooked);
        return ResponseEntity.ok(schedule);
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<TutorProfileResponse> getTutorProfile(@PathVariable UUID id) {
        TutorProfileResponse profile = tutorService.getTutorProfile(id);
        return ResponseEntity.ok(profile);
    }
    
    @GetMapping("/{id}/availability")
    public ResponseEntity<List<AvailabilityResponse>> getAvailabilities(
            @PathVariable UUID id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<AvailabilityResponse> availabilities = tutorService.getAvailabilities(id, startDate, endDate);
        return ResponseEntity.ok(availabilities);
    }
    
    /**
     * POST /tutors/{id}/availability/bulk
     * Bulk update availability với 2 modes:
     * - "this_period": Chỉ ảnh hưởng trong khoảng startDate → endDate
     * - "recurring": Ảnh hưởng toàn bộ recurring pattern
     */
    @PostMapping("/{id}/availability/bulk")
    public ResponseEntity<Void> bulkUpdateAvailability(
            @PathVariable UUID id,
            @Valid @RequestBody BulkUpdateAvailabilityRequest request) {
        
        tutorService.bulkUpdateAvailability(id, request);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
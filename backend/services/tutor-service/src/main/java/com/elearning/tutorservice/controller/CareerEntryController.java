package com.elearning.tutorservice.controller;

import com.elearning.tutorservice.dto.request.CareerEntryRequest;
import com.elearning.tutorservice.dto.response.ApiResponse;
import com.elearning.tutorservice.dto.response.CareerEntryResponse;
import com.elearning.tutorservice.service.CareerEntryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/tutors/me/career-entries")
@RequiredArgsConstructor
@Slf4j
public class CareerEntryController {

    private final CareerEntryService careerEntryService;

    /**
     * GET /tutors/me/career-entries
     * Get all career entries (education + experience) for current tutor
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CareerEntryResponse>>> getCareerEntries(
            @RequestHeader("X-User-Id") UUID tutorId) {
        log.info("Fetching career entries for tutor: {}", tutorId);
        List<CareerEntryResponse> entries = careerEntryService.getCareerEntriesByTutorId(tutorId);
        return ResponseEntity.ok(ApiResponse.success(entries, "Career entries retrieved successfully"));
    }

    /**
     * GET /tutors/me/career-entries/educations
     * Get only education entries for current tutor
     */
    @GetMapping("/educations")
    public ResponseEntity<ApiResponse<List<CareerEntryResponse>>> getEducations(
            @RequestHeader("X-User-Id") UUID tutorId) {
        log.info("Fetching educations for tutor: {}", tutorId);
        List<CareerEntryResponse> educations = careerEntryService.getEducationsByTutorId(tutorId);
        return ResponseEntity.ok(ApiResponse.success(educations, "Educations retrieved successfully"));
    }

    /**
     * GET /tutors/me/career-entries/experiences
     * Get only experience entries for current tutor
     */
    @GetMapping("/experiences")
    public ResponseEntity<ApiResponse<List<CareerEntryResponse>>> getExperiences(
            @RequestHeader("X-User-Id") UUID tutorId) {
        log.info("Fetching experiences for tutor: {}", tutorId);
        List<CareerEntryResponse> experiences = careerEntryService.getExperiencesByTutorId(tutorId);
        return ResponseEntity.ok(ApiResponse.success(experiences, "Experiences retrieved successfully"));
    }

    /**
     * POST /tutors/me/career-entries
     * Create a new career entry (education or experience)
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CareerEntryResponse>> createCareerEntry(
            @RequestHeader("X-User-Id") UUID tutorId,
            @RequestBody CareerEntryRequest request) {
        log.info("Creating career entry for tutor: {}, type: {}", tutorId, request.getType());
        CareerEntryResponse entry = careerEntryService.createCareerEntry(tutorId, request);
        return ResponseEntity.ok(ApiResponse.success(entry, "Career entry created successfully"));
    }

    /**
     * PUT /tutors/me/career-entries/{id}
     * Update an existing career entry
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CareerEntryResponse>> updateCareerEntry(
            @RequestHeader("X-User-Id") UUID tutorId,
            @PathVariable UUID id,
            @RequestBody CareerEntryRequest request) {
        log.info("Updating career entry: {} for tutor: {}", id, tutorId);
        CareerEntryResponse entry = careerEntryService.updateCareerEntry(tutorId, id, request);
        return ResponseEntity.ok(ApiResponse.success(entry, "Career entry updated successfully"));
    }

    /**
     * DELETE /tutors/me/career-entries/{id}
     * Delete a career entry
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCareerEntry(
            @RequestHeader("X-User-Id") UUID tutorId,
            @PathVariable UUID id) {
        log.info("Deleting career entry: {} for tutor: {}", id, tutorId);
        careerEntryService.deleteCareerEntry(tutorId, id);
        return ResponseEntity.ok(ApiResponse.success(null, "Career entry deleted successfully"));
    }
}

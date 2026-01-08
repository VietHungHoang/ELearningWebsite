package com.elearning.tutorservice.controller;

import com.elearning.tutorservice.dto.request.UpdateTutorProfileRequest;
import com.elearning.tutorservice.dto.response.ApiResponse;
import com.elearning.tutorservice.dto.response.TutorResponse;
import com.elearning.tutorservice.service.TutorOnboardingService;
import com.elearning.tutorservice.service.TutorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/tutors")
@RequiredArgsConstructor
@Slf4j
public class TutorController {

    private final TutorService tutorService;
    private final TutorOnboardingService tutorOnboardingService;

    /**
     * GET /tutors/me/profile
     * Get current tutor's profile using X-User-Id header
     */
    @GetMapping("/me/profile")
    public ResponseEntity<ApiResponse<TutorResponse>> getCurrentTutorProfile(
            @RequestHeader("X-User-Id") UUID tutorId) {
        log.info("Fetching profile for tutor: {}", tutorId);
        TutorResponse profile = tutorService.getTutorById(tutorId);
        return ResponseEntity.ok(ApiResponse.success(profile, "Tutor profile retrieved successfully"));
    }

    /**
     * PUT /tutors/me/profile
     * Update current tutor's profile using X-User-Id header
     */
    @PutMapping("/me/profile")
    public ResponseEntity<ApiResponse<TutorResponse>> updateCurrentTutorProfile(
            @RequestHeader("X-User-Id") UUID tutorId,
            @RequestBody UpdateTutorProfileRequest request) {
        log.info("Updating profile for tutor: {}", tutorId);
        TutorResponse updatedProfile = tutorService.updateTutorProfile(tutorId, request);
        return ResponseEntity.ok(ApiResponse.success(updatedProfile, "Tutor profile updated successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TutorResponse>> getTutorInfo(@PathVariable UUID id) {
        TutorResponse detail = tutorService.getTutorById(id);
        return ResponseEntity.ok(ApiResponse.success(detail, "Tutor detail retrieved successfully"));
    }

    @GetMapping("/batch")
    public ResponseEntity<ApiResponse<List<TutorResponse>>> getTutorsBatch(@RequestParam List<UUID> ids) {
        List<TutorResponse> tutors = tutorService.getTutorsByIds(ids);
        return ResponseEntity.ok(ApiResponse.success(tutors, "Tutors retrieved successfully"));
    }

    @GetMapping("/{tutorId}/similar")
    public ResponseEntity<ApiResponse<List<TutorResponse>>> getSimilarTutors(
            @PathVariable UUID tutorId,
            @RequestParam List<UUID> subjectIds) {
        log.info("Fetching similar tutors for tutor: {} with subjectIds: {}", tutorId, subjectIds);
        List<TutorResponse> similarTutors = tutorService.getSimilarTutors(tutorId, subjectIds);
        return ResponseEntity.ok(ApiResponse.success(similarTutors, "Similar tutors retrieved successfully"));
    }

    @PostMapping("/approve/{tutorId}")
    public ResponseEntity<ApiResponse<Void>> approveTutor(@PathVariable UUID tutorId) {
        log.info("Received tutor approval request for: {}", tutorId);
        tutorOnboardingService.approveTutor(tutorId);
        return ResponseEntity.ok(ApiResponse.success(null, "Tutor approved successfully"));
    }
}

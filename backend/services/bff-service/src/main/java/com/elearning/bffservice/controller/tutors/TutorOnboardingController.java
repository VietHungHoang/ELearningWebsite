package com.elearning.bffservice.controller.tutors;

import com.elearning.bffservice.dto.ApiResponse;
import com.elearning.bffservice.dto.response.OnboardingResponse;
import com.elearning.bffservice.dto.request.UpdateOnboardingRequest;
import com.elearning.bffservice.service.TutorService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/v1/bff/tutors")
@RequiredArgsConstructor
public class TutorOnboardingController {

    private final TutorService tutorService;

    /**
     * GET /api/v1/bff/tutors/{tutorId}/onboarding
     * Get onboarding information for a tutor
     */
    @GetMapping("/{tutorId}/onboarding")
    public ResponseEntity<ApiResponse<OnboardingResponse>> getOnboarding(
            @PathVariable UUID tutorId) {

        OnboardingResponse onboarding = tutorService.getOnboarding(tutorId);
        ApiResponse<OnboardingResponse> response = ApiResponse.success(onboarding, "Onboarding retrieved successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * PUT /api/v1/bff/tutors/{tutorId}/onboarding
     * Update onboarding data for a tutor
     */
    @PutMapping("/{tutorId}/onboarding")
    public ResponseEntity<ApiResponse<Void>> updateOnboarding(
            @PathVariable UUID tutorId,
            @RequestBody UpdateOnboardingRequest request) {

        tutorService.updateOnboarding(tutorId, request);
        ApiResponse<Void> response = ApiResponse.success(null, "Onboarding updated successfully");
        return ResponseEntity.ok(response);
    }
}

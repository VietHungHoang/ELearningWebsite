package com.elearning.tutorservice.controller;

import com.elearning.tutorservice.dto.request.UpdateOnboardingRequest;
import com.elearning.tutorservice.dto.response.ApiResponse;
import com.elearning.tutorservice.dto.response.OnboardingResponse;
import com.elearning.tutorservice.service.TutorOnboardingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/tutors")
@RequiredArgsConstructor
public class TutorOnboardingController {

    private final TutorOnboardingService tutorOnboardingService;

    @GetMapping("/{id}/onboarding")
    public ResponseEntity<ApiResponse<OnboardingResponse>> getOnboarding(@PathVariable UUID id) {
        OnboardingResponse onboarding = tutorOnboardingService.getOnboarding(id);
        return ResponseEntity.ok(ApiResponse.success(onboarding, "Onboarding data retrieved successfully"));
    }

    @PutMapping("/{id}/onboarding")
    public ResponseEntity<ApiResponse<Void>> updateOnboarding(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateOnboardingRequest request) {

        tutorOnboardingService.updateOnboarding(id, request);
        return ResponseEntity.ok(ApiResponse.success(null, "Onboarding data updated successfully"));
    }
}

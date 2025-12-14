package com.elearning.classservice.controller;

import com.elearning.classservice.dto.request.AcceptTrialSessionRequest;
import com.elearning.classservice.dto.request.TrialSessionRequest;
import com.elearning.classservice.dto.response.ApiResponse;
import com.elearning.classservice.service.TrialSessionRequestService;
import com.elearning.classservice.dto.TrialSessionRequestResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/class/trial-session")
@RequiredArgsConstructor
public class TrialSessionController {

    private final TrialSessionRequestService trialSessionRequestService;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> saveTrialSession(@RequestBody TrialSessionRequest request) {
        trialSessionRequestService.createTrialSessionRequest(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Trial session booked successfully"));
    }

    @PostMapping("/accept")
    public ResponseEntity<ApiResponse<Void>> acceptTrialSession(@RequestBody AcceptTrialSessionRequest request) {
        trialSessionRequestService.acceptTrialSessionRequest(request.getRequestId());
        return ResponseEntity.ok(ApiResponse.success(null, "Trial session accepted successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<TrialSessionRequestResponse>> getTrialSessionRequest(
            @RequestParam UUID tutorId,
            @RequestParam UUID studentId) {

        TrialSessionRequestResponse response = trialSessionRequestService.getTrialSessionRequest(tutorId, studentId);
        return ResponseEntity.ok(ApiResponse.success(response, "Trial session request retrieved successfully"));
    }

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<Map<UUID, TrialSessionRequestResponse>>> getTrialSessionRequestsByRole(
            @RequestParam String role,
            @RequestParam UUID userId) {

        Map<UUID, TrialSessionRequestResponse> response = trialSessionRequestService.getTrialSessionRequestsByRole(role, userId);
        return ResponseEntity.ok(ApiResponse.success(response, "Trial session requests retrieved successfully"));
    }
}
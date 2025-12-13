package com.elearning.bffservice.controller.classes;

import com.elearning.bffservice.bff.clas.response.TrialSessionRequestBffResponse;
import com.elearning.bffservice.dto.clas.request.TrialSessionRequest;
import com.elearning.bffservice.dto.ApiResponse;
import com.elearning.bffservice.dto.clas.response.TrialSessionRequestResponse;
import com.elearning.bffservice.service.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/bff/class/trial-session")
@RequiredArgsConstructor
public class TrialSessionController {

    private final ClassService classService;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> saveTrialSessionRequest(@RequestBody TrialSessionRequest request) {
        classService.saveTrialSessionRequest(request);
        ApiResponse<Void> response = ApiResponse.success(null, "Trial session booked successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<TrialSessionRequestResponse>> getTrialSessionRequest(
            @RequestParam UUID tutorId,
            @RequestParam UUID studentId) {

        TrialSessionRequestResponse result = classService.getTrialSessionRequest(tutorId, studentId);
        ApiResponse<TrialSessionRequestResponse> response = ApiResponse.success(result, "Trial session request retrieved successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<TrialSessionRequestBffResponse>>> getTrialSessionRequestsByRole(
            @RequestParam String role,
            @RequestParam UUID userId) {

        List<TrialSessionRequestBffResponse> result = classService.getTrialSessionRequestsByRole(role, userId);
        ApiResponse<List<TrialSessionRequestBffResponse>> response = ApiResponse.success(result, "Trial session requests retrieved successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{requestId}/accept")
    public ResponseEntity<ApiResponse<Void>> acceptTrialSessionRequest(@PathVariable UUID requestId) {
        classService.acceptTrialSessionRequest(requestId);
        ApiResponse<Void> response = ApiResponse.success(null, "Trial session request accepted successfully");
        return ResponseEntity.ok(response);
    }

}

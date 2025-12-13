package com.elearning.bffservice.controller;

import com.elearning.bffservice.bff.clas.response.TrialSessionRequestBffResponse;
import com.elearning.bffservice.dto.clas.request.TrialSessionRequest;
import com.elearning.bffservice.dto.clas.request.ZoomOAuthCallbackRequest;
import com.elearning.bffservice.dto.clas.response.ZoomAuthorizationUrlResponse;
import com.elearning.bffservice.dto.ApiResponse;
import com.elearning.bffservice.dto.response.BookedSessionsData;
import com.elearning.bffservice.service.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/v1/bff/class")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;

    @GetMapping("/zoom/authorize")
    public ResponseEntity<ApiResponse<ZoomAuthorizationUrlResponse>> getZoomAuthorizationUrl(
            @RequestParam UUID tutorId) {
        ZoomAuthorizationUrlResponse data = classService.getZoomAuthorizationUrl(tutorId);
        ApiResponse<ZoomAuthorizationUrlResponse> response = ApiResponse.success(data, "Authorization URL generated successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/zoom/callback")
    public ResponseEntity<ApiResponse<Void>> handleZoomOAuthCallback(@RequestBody ZoomOAuthCallbackRequest request) {
        classService.handleZoomOAuthCallback(request);
        ApiResponse<Void> response = ApiResponse.success(null, "Zoom account connected successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/sessions/tutors/{tutorId}")
    public ResponseEntity<ApiResponse<BookedSessionsData>> getTutorBookedSessions(
            @PathVariable UUID tutorId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {

        BookedSessionsData sessions = classService.getBookedSessionsWithStudents(tutorId, startDate, endDate);
        ApiResponse<BookedSessionsData> response = ApiResponse.success(sessions, "Booked sessions retrieved successfully");
        return ResponseEntity.ok(response);
    }
}
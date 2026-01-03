package com.elearning.tutorservice.controller;

import com.elearning.tutorservice.dto.response.ApiResponse;
import com.elearning.tutorservice.service.ZoomOAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/internal/tutors/zoom")
@RequiredArgsConstructor
@Slf4j
public class InternalZoomController {

    private final ZoomOAuthService zoomOAuthService;

    @GetMapping("/{tutorId}/token")
    public ResponseEntity<ApiResponse<String>> getZoomAccessToken(@PathVariable UUID tutorId) {
        String accessToken = zoomOAuthService.getValidAccessToken(tutorId);
        return ResponseEntity.ok(ApiResponse.success(accessToken, "Access token retrieved successfully"));
    }
}

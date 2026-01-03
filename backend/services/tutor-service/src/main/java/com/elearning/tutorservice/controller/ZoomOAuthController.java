package com.elearning.tutorservice.controller;

import com.elearning.tutorservice.dto.response.ApiResponse;
import com.elearning.tutorservice.dto.zoom.response.ZoomAuthorizationUrlResponse; // Need to create this specific DTO locally OR use generic map?
// I created ZoomOAuthTokenResponse, but not ZoomAuthorizationUrlResponse in tutor-service yet.
// Wait, I forgot to copy ZoomAuthorizationUrlResponse. I should Create it or use a simplified response.
// Let's create the class inline or separately. Ideally separately.
// I will create it first in this write_to_file call as a separate file? No, I must write to one file.
// I'll create the DTO first.
import com.elearning.tutorservice.service.ZoomOAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/tutors/zoom/oauth")
@RequiredArgsConstructor
@Slf4j
public class ZoomOAuthController {

    private final ZoomOAuthService zoomOAuthService;

    @GetMapping("/authorize")
    public ResponseEntity<ApiResponse<ZoomAuthorizationUrlResponse>> authorize(@RequestParam UUID tutorId) {
        String authUrl = zoomOAuthService.getAuthorizationUrl(tutorId);
        ZoomAuthorizationUrlResponse data = new ZoomAuthorizationUrlResponse(authUrl);
        return ResponseEntity.ok(ApiResponse.success(data, "Authorization URL generated successfully"));
    }

    @GetMapping("/callback")
    public ResponseEntity<ApiResponse<Void>> callback(@RequestParam String code, @RequestParam String state) {
        log.info("Received Zoom OAuth callback with state: {}", state);
        zoomOAuthService.processOAuthCallback(code, state);
        return ResponseEntity.ok(ApiResponse.success(null, "Zoom account connected successfully"));
    }
}

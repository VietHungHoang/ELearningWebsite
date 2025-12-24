package com.elearning.classservice.controller;

import com.elearning.classservice.dto.response.ApiResponse;
import com.elearning.classservice.dto.zoom.response.ZoomAuthorizationUrlResponse;
import com.elearning.classservice.service.ZoomOAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/tutors/zoom/oauth")
@RequiredArgsConstructor
@Slf4j
public class ZoomOAuthController {

    private final ZoomOAuthService zoomOAuthService;

    /**
     * GET /api/v1/zoom/oauth/authorize?tutorId={tutorId}
     * Get Zoom authorization URL for client to redirect
     */
    @GetMapping("/authorize")
    public ResponseEntity<ApiResponse<ZoomAuthorizationUrlResponse>> authorize(@RequestParam UUID tutorId) {
        String authUrl = zoomOAuthService.getAuthorizationUrl(tutorId);
        ZoomAuthorizationUrlResponse data = new ZoomAuthorizationUrlResponse(authUrl);
        ApiResponse<ZoomAuthorizationUrlResponse> response = ApiResponse.success(data, "Authorization URL generated successfully");
        return ResponseEntity.ok(response);
    }
}

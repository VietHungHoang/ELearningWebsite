package com.elearning.classservice.controller;

import com.elearning.classservice.dto.request.ZoomOAuthCallbackRequest;
import com.elearning.classservice.dto.response.ApiResponse;
import com.elearning.classservice.dto.response.ZoomAuthorizationUrlResponse;
import com.elearning.classservice.service.ZoomOAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Controller for Zoom OAuth operations
 */
@RestController
@RequestMapping("/api/v1/zoom/oauth")
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
        log.info("Initiating Zoom OAuth for tutor: {}", tutorId);
        String authUrl = zoomOAuthService.getAuthorizationUrl(tutorId);
        
        ZoomAuthorizationUrlResponse data = new ZoomAuthorizationUrlResponse(authUrl);
        ApiResponse<ZoomAuthorizationUrlResponse> response = ApiResponse.success(data, "Authorization URL generated successfully");
        
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/v1/zoom/oauth/callback
     * Handle Zoom OAuth callback
     */
    @PostMapping("/callback")
    public ResponseEntity<ApiResponse<Void>> callback(@Valid @RequestBody ZoomOAuthCallbackRequest request) {
        
        UUID tutorId = UUID.fromString(request.getState());
        log.info("Handling Zoom OAuth callback for tutor: {}", tutorId);
        
        zoomOAuthService.handleCallback(request.getCode(), tutorId);
        
        return ResponseEntity.ok(ApiResponse.success(null, "Zoom account connected successfully"));
    }

    /**
     * GET /api/v1/zoom/oauth/status/{tutorId}
     * Check if tutor has connected Zoom
     */
    @GetMapping("/status/{tutorId}")
    public ResponseEntity<Map<String, Boolean>> checkStatus(@PathVariable UUID tutorId) {
        boolean isConnected = zoomOAuthService.isConnected(tutorId);
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("connected", isConnected);
        
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/v1/zoom/oauth/disconnect/{tutorId}
     * Disconnect Zoom account
     */
    @DeleteMapping("/disconnect/{tutorId}")
    public ResponseEntity<Map<String, String>> disconnect(@PathVariable UUID tutorId) {
        log.info("Disconnecting Zoom for tutor: {}", tutorId);
        
        zoomOAuthService.disconnectZoom(tutorId);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Zoom account disconnected successfully");
        response.put("tutorId", tutorId.toString());
        
        return ResponseEntity.ok(response);
    }
}

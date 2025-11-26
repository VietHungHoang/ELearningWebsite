package com.elearning.classservice.controller;

import com.elearning.classservice.service.ZoomOAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

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
     * Redirect tutor to Zoom OAuth page
     */
    @GetMapping("/authorize")
    public RedirectView authorize(@RequestParam UUID tutorId) {
        log.info("Initiating Zoom OAuth for tutor: {}", tutorId);
        String authUrl = zoomOAuthService.getAuthorizationUrl(tutorId);
        return new RedirectView(authUrl);
    }

    /**
     * GET /api/v1/zoom/oauth/callback?code={code}&statestate={tutorId}
     * Handle Zoom OAuth callback
     */
    @GetMapping("/callback")
    public ResponseEntity<Map<String, String>> callback(
            @RequestParam String code,
            @RequestParam String state) {
        
        UUID tutorId = UUID.fromString(state);
        log.info("Handling Zoom OAuth callback for tutor: {}", tutorId);
        
        zoomOAuthService.handleCallback(code, tutorId);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Zoom account connected successfully");
        response.put("tutorId", tutorId.toString());
        response.put("status", "connected");
        
        return ResponseEntity.ok(response);
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

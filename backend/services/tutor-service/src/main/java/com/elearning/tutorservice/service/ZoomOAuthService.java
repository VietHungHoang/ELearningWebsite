package com.elearning.tutorservice.service;

import java.util.UUID;

public interface ZoomOAuthService {
    
    /**
     * Generate Zoom OAuth authorization URL
     */
    String getAuthorizationUrl(UUID tutorId);
    
    /**
     * Process OAuth callback from Zoom
     * @param code Authorization code
     * @param state State parameter (tutorId)
     */
    void processOAuthCallback(String code, String state);
    
    /**
     * Refresh access token for a tutor
     */
    void refreshAccessToken(UUID tutorId);
    
    /**
     * Get valid access token (refresh if expired)
     */
    String getValidAccessToken(UUID tutorId);
}

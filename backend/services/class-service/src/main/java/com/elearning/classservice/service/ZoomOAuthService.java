package com.elearning.classservice.service;

import java.util.UUID;

/**
 * Service for managing Zoom OAuth operations
 */
public interface ZoomOAuthService {
    
    /**
     * Generate Zoom OAuth authorization URL
     * @param tutorId tutor ID to store in state parameter
     * @return authorization URL to redirect user to
     */
    String getAuthorizationUrl(UUID tutorId);
    
    /**
     * Handle OAuth callback and exchange code for access token
     * @param code authorization code from Zoom
     * @param tutorId tutor ID from state parameter
     */
    void handleCallback(String code, UUID tutorId);
    
    /**
     * Refresh access token for a tutor
     * @param tutorId tutor ID
     */
    void refreshAccessToken(UUID tutorId);
    
    /**
     * Check if tutor has connected Zoom account
     * @param tutorId tutor ID
     * @return true if connected
     */
    boolean isConnected(UUID tutorId);
    
    /**
     * Disconnect Zoom account (delete credentials)
     * @param tutorId tutor ID
     */
    void disconnectZoom(UUID tutorId);
    
    /**
     * Get valid access token for tutor (auto-refresh if expired)
     * @param tutorId tutor ID
     * @return valid access token
     */
    String getValidAccessToken(UUID tutorId);
}

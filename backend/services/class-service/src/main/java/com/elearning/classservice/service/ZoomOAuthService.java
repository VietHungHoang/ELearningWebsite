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
     * Refresh access token for a tutor
     * @param tutorId tutor ID
     */
    void refreshAccessToken(UUID tutorId);
    
    /**
     * Get valid access token for tutor (auto-refresh if expired)
     * @param tutorId tutor ID
     * @return valid access token
     */
    String getValidAccessToken(UUID tutorId);
}

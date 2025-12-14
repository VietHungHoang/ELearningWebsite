package com.elearning.authservice.service;

import com.elearning.authservice.dto.request.GoogleLoginRequest;
import com.elearning.authservice.dto.response.LoginResponse;

/**
 * Service for OAuth operations (Google authentication)
 */
public interface OAuthService {
    String getGoogleAuthUrl(String redirectUri);

    LoginResponse loginWithGoogle(GoogleLoginRequest request);
}
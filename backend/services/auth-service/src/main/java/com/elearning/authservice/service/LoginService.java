package com.elearning.authservice.service;

import com.elearning.authservice.dto.request.LoginRequest;
import com.elearning.authservice.dto.request.RefreshTokenRequest;
import com.elearning.authservice.dto.response.LoginResponse;

/**
 * Service for user login and token management operations
 */
public interface LoginService {
    LoginResponse login(LoginRequest request);

    LoginResponse refreshToken(RefreshTokenRequest request);
}
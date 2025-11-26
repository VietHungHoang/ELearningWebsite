package com.elearning.authservice.service;

import com.elearning.authservice.dto.request.GoogleLoginRequest;
import com.elearning.authservice.dto.request.LoginRequest;
import com.elearning.authservice.dto.request.RefreshTokenRequest;
import com.elearning.authservice.dto.request.RegistrationStartRequest;
import com.elearning.authservice.dto.request.VerifyOtpRequest;
import com.elearning.authservice.dto.response.LoginResponse;

import java.util.List;

import com.elearning.authservice.dto.request.SetPasswordRequest;

public interface AuthService {
    void startRegistration(RegistrationStartRequest request);

    void verifyOtp(VerifyOtpRequest request);

    void createAccount(SetPasswordRequest request);

    LoginResponse login(LoginRequest request);
    
    LoginResponse refreshToken(RefreshTokenRequest request);
    
    String getGoogleAuthUrl(String redirectUri);
    
    LoginResponse loginWithGoogle(GoogleLoginRequest request);

    void bulkCreateAccounts(List<RegistrationStartRequest> requests);
}
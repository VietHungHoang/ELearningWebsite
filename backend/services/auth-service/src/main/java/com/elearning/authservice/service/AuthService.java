package com.elearning.authservice.service;

import com.elearning.authservice.dto.request.LoginRequest;
import com.elearning.authservice.dto.request.RegistrationStartRequest;
import com.elearning.authservice.dto.request.VerifyOtpRequest;
import com.elearning.authservice.dto.response.LoginResponse;

public interface AuthService {
    void startRegistration(RegistrationStartRequest request);

    void verifyOtp(VerifyOtpRequest request);

    void setPassword(String email, String password);

    LoginResponse login(LoginRequest request);
}
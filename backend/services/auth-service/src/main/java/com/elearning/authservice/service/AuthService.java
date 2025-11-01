package com.elearning.authservice.service;

import com.elearning.authservice.dto.request.LoginRequest;
import com.elearning.authservice.dto.request.RegistrationStartRequest;
import com.elearning.authservice.dto.request.SetPasswordRequest;
import com.elearning.authservice.dto.request.VerifyOtpRequest;
import com.elearning.authservice.dto.response.LoginResponse;
import com.elearning.authservice.dto.response.VerifyOtpResponse;

public interface AuthService {
    void startRegistration(RegistrationStartRequest request);

    VerifyOtpResponse verifyOtp(VerifyOtpRequest request);

    void setPassword(String token, SetPasswordRequest request);

    LoginResponse login(LoginRequest request);
}
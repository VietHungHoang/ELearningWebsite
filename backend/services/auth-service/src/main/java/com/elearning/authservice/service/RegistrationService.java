package com.elearning.authservice.service;

import com.elearning.authservice.dto.request.RegistrationStartRequest;
import com.elearning.authservice.dto.request.SetPasswordRequest;
import com.elearning.authservice.dto.request.VerifyOtpRequest;
import com.elearning.authservice.dto.response.AccountCreatedResponse;

public interface RegistrationService {
    void startRegistration(RegistrationStartRequest request);

    void verifyOtp(VerifyOtpRequest request);

    AccountCreatedResponse createAccount(SetPasswordRequest request);
}
package com.elearning.authservice.service;

import com.elearning.authservice.dto.request.RegistrationStartRequest;

public interface AuthService {
    void startRegistration(RegistrationStartRequest request);
}
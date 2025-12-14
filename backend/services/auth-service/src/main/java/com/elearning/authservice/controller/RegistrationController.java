package com.elearning.authservice.controller;

import com.elearning.authservice.dto.request.RegistrationStartRequest;
import com.elearning.authservice.dto.request.SetPasswordRequest;
import com.elearning.authservice.dto.request.VerifyOtpRequest;
import com.elearning.authservice.dto.response.AccountCreatedResponse;
import com.elearning.authservice.dto.response.ApiResponse;
import com.elearning.authservice.service.RegistrationService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for user registration related operations
 */
@RestController
@RequestMapping("/api/v1/auth/registration")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<Void>> startRegistration(@RequestBody RegistrationStartRequest request) {
        registrationService.startRegistration(request);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.created("OTP sent successfully", null));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(@RequestBody VerifyOtpRequest request) {
        registrationService.verifyOtp(request);
        return ResponseEntity.ok(ApiResponse.success("OTP verified successfully", null));
    }

    @PostMapping("/create-account")
    public ResponseEntity<ApiResponse<AccountCreatedResponse>> createAccount(@RequestBody SetPasswordRequest request) {
        AccountCreatedResponse response = registrationService.createAccount(request);
        return ResponseEntity.ok(ApiResponse.created("Account created successfully", response));
    }
}
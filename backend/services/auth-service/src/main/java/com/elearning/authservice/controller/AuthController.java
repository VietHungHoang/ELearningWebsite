package com.elearning.authservice.controller;

import com.elearning.authservice.dto.request.LoginRequest;
import com.elearning.authservice.dto.request.RegistrationStartRequest;
import com.elearning.authservice.dto.request.SetPasswordRequest;
import com.elearning.authservice.dto.request.VerifyOtpRequest;
import com.elearning.authservice.dto.response.ApiResponse;
import com.elearning.authservice.dto.response.LoginResponse;
import com.elearning.authservice.service.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/registration/start")
    public ResponseEntity<ApiResponse<Void>> startRegistration(@RequestBody RegistrationStartRequest request) {
        authService.startRegistration(request);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.created("OTP sent successfully", null));
    }

    @PostMapping("/registration/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(@RequestBody VerifyOtpRequest request) {
        authService.verifyOtp(request);
        return ResponseEntity.ok(ApiResponse.success("OTP verified successfully", null));
    }

    @PostMapping("/registration/set-password")
    public ResponseEntity<ApiResponse<Void>> setPassword(@RequestBody SetPasswordRequest request) {
        authService.setPassword(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(ApiResponse.success("Password set successfully", null));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request) {
        LoginResponse tokens = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", tokens));
    }
}
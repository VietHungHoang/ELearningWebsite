package com.elearning.authservice.controller;

import com.elearning.authservice.dto.request.GoogleLoginRequest;
import com.elearning.authservice.dto.request.LoginRequest;
import com.elearning.authservice.dto.request.RegistrationStartRequest;
import com.elearning.authservice.dto.request.SetPasswordRequest;
import com.elearning.authservice.dto.request.VerifyOtpRequest;
import com.elearning.authservice.dto.response.ApiResponse;
import com.elearning.authservice.dto.response.GoogleAuthUrlResponse;
import com.elearning.authservice.dto.response.LoginResponse;
import com.elearning.authservice.service.AuthService;

import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Enumeration;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

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

    @PostMapping("/registration/create-account")
    public ResponseEntity<ApiResponse<Void>> createAccount(@RequestBody SetPasswordRequest request) {
        authService.createAccount(request);
        return ResponseEntity.ok(ApiResponse.success("Account created successfully", null));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        // Log headers
        Enumeration<String> headerNames = httpRequest.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            String headerValue = httpRequest.getHeader(headerName);
            logger.info("Header: {} = {}", headerName, headerValue);
        }

        LoginResponse tokens = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", tokens));
    }

    @GetMapping("/google/auth-url")
    public ResponseEntity<ApiResponse<GoogleAuthUrlResponse>> getGoogleAuthUrl(@RequestParam String redirectUri) {
        String authUrl = authService.getGoogleAuthUrl(redirectUri);
        GoogleAuthUrlResponse response = GoogleAuthUrlResponse.builder()
                .authUrl(authUrl)
                .build();
        return ResponseEntity.ok(ApiResponse.success("Google auth URL generated", response));
    }

    @PostMapping("/google/callback")
    public ResponseEntity<ApiResponse<LoginResponse>> googleCallback(@RequestBody GoogleLoginRequest request) {
        LoginResponse tokens = authService.loginWithGoogle(request);
        return ResponseEntity.ok(ApiResponse.success("Google login successful", tokens));
    }

    
}
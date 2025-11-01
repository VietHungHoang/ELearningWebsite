package com.elearning.authservice.controller;

import com.elearning.authservice.dto.request.LoginRequest;
import com.elearning.authservice.dto.request.VerifyOtpRequest;
import com.elearning.authservice.dto.response.ApiResponse;
import com.elearning.authservice.dto.response.LoginResponse;
import com.elearning.authservice.dto.response.VerifyOtpResponse;
import com.elearning.authservice.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/registration/start")
    public ResponseEntity<ApiResponse<Void>> startRegistration(@RequestBody RegistrationStartRequest request) {
        authService.startRegistration(request);
        return ResponseEntity.status(201).body(ApiResponse.created("OTP sent successfully", null));
    }

    @PostMapping("/registration/verify-otp")
    public ResponseEntity<ApiResponse<VerifyOtpResponse>> verifyOtp(@RequestBody VerifyOtpRequest request) {
        VerifyOtpResponse response = authService.verifyOtp(request);
        return ResponseEntity.ok(ApiResponse.success("OTP verified successfully", response));
    }

    @PostMapping("/registration/set-password")
    public ResponseEntity<ApiResponse<Void>> setPassword(@RequestHeader("Authorization") String token, @RequestBody SetPasswordRequest request) {
        authService.setPassword(token, request);
        return ResponseEntity.ok(ApiResponse.success("Password set successfully", null));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request) {
        LoginResponse tokens = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", tokens));
    }
}
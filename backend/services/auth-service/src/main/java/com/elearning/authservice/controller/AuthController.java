package com.elearning.authservice.controller;

import com.elearning.authservice.dto.request.RegistrationStartRequest;
import com.elearning.authservice.dto.response.ApiResponse;
import com.elearning.authservice.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
}
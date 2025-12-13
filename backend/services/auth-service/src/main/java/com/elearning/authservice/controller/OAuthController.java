package com.elearning.authservice.controller;

import com.elearning.authservice.dto.request.GoogleLoginRequest;
import com.elearning.authservice.dto.response.ApiResponse;
import com.elearning.authservice.dto.response.GoogleAuthUrlResponse;
import com.elearning.authservice.dto.response.LoginResponse;
import com.elearning.authservice.service.OAuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for OAuth operations (Google authentication)
 */
@RestController
@RequestMapping("/api/v1/auth/google")
@RequiredArgsConstructor
public class OAuthController {

    private final OAuthService oauthService;

    @GetMapping("/auth-url")
    public ResponseEntity<ApiResponse<GoogleAuthUrlResponse>> getGoogleAuthUrl(@RequestParam String redirectUri) {
        String authUrl = oauthService.getGoogleAuthUrl(redirectUri);
        GoogleAuthUrlResponse response = GoogleAuthUrlResponse.builder()
                .authUrl(authUrl)
                .build();
        return ResponseEntity.ok(ApiResponse.success("Google auth URL generated", response));
    }

    @PostMapping("/callback")
    public ResponseEntity<ApiResponse<LoginResponse>> googleCallback(@RequestBody GoogleLoginRequest request) {
        LoginResponse tokens = oauthService.loginWithGoogle(request);
        return ResponseEntity.ok(ApiResponse.success("Google login successful", tokens));
    }
}
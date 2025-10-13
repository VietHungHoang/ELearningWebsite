package com.elearning.apigateway.controller;

import com.elearning.apigateway.bff.response.UserProfileResponse;
import com.elearning.apigateway.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bff/users")
@Slf4j
@RequiredArgsConstructor
public class UserBffController {

    private final UserProfileService userProfileService;

    @GetMapping("/{userId}/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable Long userId) {
        log.info("BFF request for user profile: userId={}", userId);

        UserProfileResponse response = userProfileService.getUserProfile(userId);

        return ResponseEntity.ok(response);
    }
}
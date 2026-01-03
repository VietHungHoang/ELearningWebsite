package com.elearning.authservice.controller;

import com.elearning.authservice.dto.response.ApiResponse;
import com.elearning.authservice.dto.response.UserResponse;
import com.elearning.authservice.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    /**
     * Get user by ID
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable String userId) {
        log.info("Getting user by ID: {}", userId);
        UserResponse user = userService.getUserById(userId);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    /**
     * Get multiple users by IDs
     */
    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getUsersByIds(@RequestBody List<String> userIds) {
        log.info("Getting users by IDs: {}", userIds);
        List<UserResponse> users = userService.getUsersByIds(userIds);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    /**
     * Update user avatar URL
     */
    @PutMapping("/{userId}/avatar")
    public ResponseEntity<ApiResponse<Void>> updateUserAvatar(
            @PathVariable String userId,
            @RequestBody String avatarUrl) {
        log.info("Updating avatar for user: {}", userId);
        userService.updateUserAvatar(userId, avatarUrl);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}

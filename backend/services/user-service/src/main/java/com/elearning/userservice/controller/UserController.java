package com.elearning.userservice.controller;

import com.elearning.userservice.dto.response.UserInfoResponse;
import com.elearning.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST controller for user operations
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    /**
     * Batch retrieve users by their IDs
     * @param ids List of user IDs
     * @return Map of ID to user information
     */
    @PostMapping("/batch")
    public ResponseEntity<Map<UUID, UserInfoResponse>> batchGetUsers(@RequestBody List<UUID> ids) {
        Map<UUID, UserInfoResponse> users = userService.batchGetUsers(ids);
        return ResponseEntity.ok(users);
    }
}

package com.elearning.tutorservice.controller;

import com.elearning.tutorservice.dto.response.ApiResponse;
import com.elearning.tutorservice.dto.response.UserInfoResponse;
import com.elearning.tutorservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tutors/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/batch")
    public ResponseEntity<ApiResponse<List<UserInfoResponse>>> getUserInfoByIds(@RequestParam List<UUID> ids) {
        List<UserInfoResponse> response = userService.getUsersByIds(ids);
        return ResponseEntity.ok(ApiResponse.success(response, "Tutors retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserInfoResponse>> getUserInfoById(@PathVariable UUID id) {
        UserInfoResponse response = userService.getUserById(id);
        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ApiResponse.success(response, "Tutor retrieved successfully"));
    }
}

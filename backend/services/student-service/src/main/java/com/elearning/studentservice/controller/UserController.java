package com.elearning.studentservice.controller;

import com.elearning.studentservice.dto.response.ApiResponse;
import com.elearning.studentservice.dto.response.UserInfoResponse;
import com.elearning.studentservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/students/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/batch")
    public ResponseEntity<ApiResponse<List<UserInfoResponse>>> getUserInfoByIds(@RequestParam List<UUID> ids) {
        List<UserInfoResponse> response = userService.getUsersByIds(ids);
        return ResponseEntity.ok(ApiResponse.success(response, "Students retrieved successfully"));
    }
}

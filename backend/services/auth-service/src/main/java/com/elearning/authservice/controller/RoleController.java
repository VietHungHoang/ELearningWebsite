package com.elearning.authservice.controller;

import com.elearning.authservice.dto.response.ApiResponse;
import com.elearning.authservice.service.RoleService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for user role management operations
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @PostMapping("/assign-tutor-role/{userId}")
    public ResponseEntity<ApiResponse<Void>> assignTutorRole(@PathVariable String userId) {
        roleService.assignTutorRole(userId);
        return ResponseEntity.ok(ApiResponse.success("Tutor role assigned successfully", null));
    }
}
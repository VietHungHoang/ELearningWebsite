package com.elearning.bffservice.controller;

import com.elearning.bffservice.dto.ApiResponse;
import com.elearning.bffservice.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/v1/bff/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/tutors/{tutorId}/approve")
    public ResponseEntity<ApiResponse<Void>> approveTutor(@PathVariable UUID tutorId) {
        adminService.approveTutor(tutorId);
        return ResponseEntity.ok(ApiResponse.<Void>success(null, "Tutor approved successfully"));
    }
}
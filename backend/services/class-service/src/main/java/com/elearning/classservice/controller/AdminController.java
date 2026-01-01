package com.elearning.classservice.controller;

import com.elearning.classservice.dto.response.ApiResponse;
import com.elearning.classservice.dto.response.CompletedSessionsData;
import com.elearning.classservice.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

/**
 * Admin controller for dashboard statistics
 */
@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    /**
     * GET /api/v1/admin/dashboard/completed-sessions
     * Get completed sessions statistics for admin dashboard
     */
    @GetMapping("/completed-sessions")
    public ResponseEntity<ApiResponse<CompletedSessionsData>> getCompletedSessions(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        CompletedSessionsData data = adminService.getCompletedSessionsData(startDate, endDate);
        ApiResponse<CompletedSessionsData> response = ApiResponse.success(data, "Completed sessions data retrieved successfully");
        return ResponseEntity.ok(response);
    }
}
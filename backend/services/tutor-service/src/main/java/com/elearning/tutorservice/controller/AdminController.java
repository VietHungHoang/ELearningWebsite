package com.elearning.tutorservice.controller;

import com.elearning.tutorservice.dto.response.ApiResponse;
import com.elearning.tutorservice.dto.response.NewStudentsResponse;
import com.elearning.tutorservice.dto.response.NewTutorsResponse;
import com.elearning.tutorservice.dto.response.TutorPendingApprovalsResponse;
import com.elearning.tutorservice.service.AdminService;
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
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    /**
     * GET /api/v1/admin/dashboard/tutor-pending-approvals
     * Get tutor pending approvals statistics
     */
    @GetMapping("/tutor-pending-approvals")
    public ResponseEntity<ApiResponse<TutorPendingApprovalsResponse>> getTutorPendingApprovals(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        TutorPendingApprovalsResponse data = adminService.getTutorPendingApprovals(startDate, endDate);
        ApiResponse<TutorPendingApprovalsResponse> response = ApiResponse.success(data, "Tutor pending approvals data retrieved successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/admin/dashboard/new-students
     * Get new students statistics
     */
    @GetMapping("/new-students")
    public ResponseEntity<ApiResponse<NewStudentsResponse>> getNewStudents(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        NewStudentsResponse data = adminService.getNewStudents(startDate, endDate);
        ApiResponse<NewStudentsResponse> response = ApiResponse.success(data, "New students data retrieved successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/admin/dashboard/new-tutors
     * Get new tutors statistics
     */
    @GetMapping("/new-tutors")
    public ResponseEntity<ApiResponse<NewTutorsResponse>> getNewTutors(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        NewTutorsResponse data = adminService.getNewTutors(startDate, endDate);
        ApiResponse<NewTutorsResponse> response = ApiResponse.success(data, "New tutors data retrieved successfully");
        return ResponseEntity.ok(response);
    }
}
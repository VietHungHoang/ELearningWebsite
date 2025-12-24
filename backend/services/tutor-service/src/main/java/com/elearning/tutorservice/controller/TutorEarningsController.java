package com.elearning.tutorservice.controller;

import com.elearning.tutorservice.dto.response.ApiResponse;
import com.elearning.tutorservice.dto.tutor_earnings.response.TutorEarningsResponse;
import com.elearning.tutorservice.dto.tutor_earnings.response.TutorEarningsStatsResponse;
import com.elearning.tutorservice.entity.enums.ClassType;
import com.elearning.tutorservice.service.TutorEarningsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/tutors")
@RequiredArgsConstructor
public class TutorEarningsController {

    private final TutorEarningsService tutorEarningsService;

    /**
     * GET /api/v1/classes/tutors-earnings/tutors/{tutorId}
     * Lấy tất cả earnings của tutor với phân trang và lọc theo class type
     */
    @GetMapping("/me/earnings")
    public ResponseEntity<ApiResponse<Page<TutorEarningsResponse>>> getEarningsByTutorId(
            @RequestHeader("X-User-Id") UUID tutorId,
            @RequestParam(required = false) String classType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Pageable pageable = PageRequest.of(page, size);

        ClassType type = null;
        if (classType != null && !classType.trim().isEmpty()) {
            type = ClassType.valueOf(classType.toUpperCase());
        }

        Page<TutorEarningsResponse> earnings = tutorEarningsService.getEarningsByTutorId(tutorId, type, pageable);

        ApiResponse<Page<TutorEarningsResponse>> response = ApiResponse.success(earnings, "Tutor earnings retrieved successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/tutors/me/earnings/stats
     * Lấy tổng kết thu nhập của tutor
     */
    @GetMapping("/me/earnings/stats")
    public ResponseEntity<ApiResponse<TutorEarningsStatsResponse>> getEarningsStatsByTutorId(
            @RequestHeader("X-User-Id") UUID tutorId) {
        TutorEarningsStatsResponse stat = tutorEarningsService.getEarningsStatsByTutorId(tutorId);
        ApiResponse<TutorEarningsStatsResponse> response = ApiResponse.success(stat, "Tutor earnings stat retrieved successfully");
        return ResponseEntity.ok(response);
    }
}
package com.elearning.tutorservice.controller;

import com.elearning.tutorservice.dto.response.ApiResponse;
import com.elearning.tutorservice.dto.tutor_stats.response.TutorDashboardStatisticsResponse;
import com.elearning.tutorservice.dto.tutor_stats.response.TutorMonthlyIncomeResponse;
import com.elearning.tutorservice.service.TutorStatisticService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/tutors")
@RequiredArgsConstructor
public class TutorStatsController {

    private final TutorStatisticService tutorStatisticService;

    /**
     * GET /api/v1/tutors/{tutorId}/stats
     * Lấy thống kê cho trang tutor dashboard theo thời gian
     */
    @GetMapping("/me/dashboard/stats")
    public ResponseEntity<ApiResponse<TutorDashboardStatisticsResponse>> getTutorStats(
            @RequestHeader("X-User-Id") UUID tutorId,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate) {

        TutorDashboardStatisticsResponse statistics = tutorStatisticService.getTutorStatistics(tutorId, startDate, endDate);
        ApiResponse<TutorDashboardStatisticsResponse> response = ApiResponse.success(statistics, "Tutor statistics retrieved successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/tutors/me/income
     * <p>
     * Get monthly income statistics for the current tutor in the last 12 months
     *
     * @param tutorId ID of the tutor from header
     * @return Monthly income statistics
     */
    @GetMapping("/me/income")
    public ResponseEntity<ApiResponse<TutorMonthlyIncomeResponse>> getMonthlyIncomeStats(
            @RequestHeader("X-User-Id") UUID tutorId) {
        var stats = tutorStatisticService.getMonthlyIncomeStats(tutorId);
        TutorMonthlyIncomeResponse response = TutorMonthlyIncomeResponse.builder()
                .incomes(stats)
                .build();
        return ResponseEntity.ok(ApiResponse.success(response, "Monthly income statistics retrieved successfully"));
    }
}

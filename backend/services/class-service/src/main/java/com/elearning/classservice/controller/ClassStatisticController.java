package com.elearning.classservice.controller;

import com.elearning.classservice.dto.response.ApiResponse;
import com.elearning.classservice.dto.response.MonthlyStudentStats;
import com.elearning.classservice.dto.response.TutorMonthlyStatsResponse;
import com.elearning.classservice.service.ClassStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/classes/statistics")
@RequiredArgsConstructor
public class ClassStatisticController {

    private final ClassStatisticsService classStatisticsService;

    /**
     * GET /api/v1/classes/statistics/me/students
     * <p>
     * Get monthly student statistics for the current tutor in the last 12 months
     * @param tutorId ID of the tutor from header
     * @return Monthly student statistics
     */
    @GetMapping("/me/students")
    public ResponseEntity<ApiResponse<TutorMonthlyStatsResponse>> getMonthlyStudentStats(
            @RequestHeader("X-User-Id") UUID tutorId) {
        List<MonthlyStudentStats> stats = classStatisticsService.getMonthlyStudentStats(tutorId);
        TutorMonthlyStatsResponse response = TutorMonthlyStatsResponse.builder()
                .students(stats)
                .build();
        return ResponseEntity.ok(ApiResponse.success(response, "Monthly student statistics retrieved successfully"));
    }
}

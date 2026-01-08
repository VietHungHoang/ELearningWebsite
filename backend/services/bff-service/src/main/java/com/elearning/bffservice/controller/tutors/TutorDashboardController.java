package com.elearning.bffservice.controller.tutors;

import com.elearning.bffservice.dto.ApiResponse;
import com.elearning.bffservice.dto.tutor.response.TutorDashboardChartsResponse;
import com.elearning.bffservice.service.TutorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/v1/bff/tutors")
@RequiredArgsConstructor
public class TutorDashboardController {

    private final TutorService tutorService;

    /**
     * GET /api/v1/bff/tutors/me/dashboard/charts
     * <p>
     * Get dashboard charts data for the current tutor including monthly students
     * and income stats
     *
     * @param tutorId ID of the tutor from header
     * @return Dashboard charts data
     */
    @GetMapping("/me/dashboard/charts")
    public ResponseEntity<ApiResponse<TutorDashboardChartsResponse>> getDashboardCharts(
            @RequestHeader("X-User-Id") UUID tutorId) {
        TutorDashboardChartsResponse response = tutorService.getDashboardCharts(tutorId);
        return ResponseEntity.ok(ApiResponse.success(response, "Dashboard charts retrieved successfully"));
    }
}

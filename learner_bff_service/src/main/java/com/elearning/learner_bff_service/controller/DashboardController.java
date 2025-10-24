package com.elearning.learner_bff_service.controller;

import com.elearning.learner_bff_service.bff.response.DashboardResponse;
import com.elearning.learner_bff_service.dto.response.ApiResponse;
import com.elearning.learner_bff_service.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/bff/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/{accountId}")
    @SuppressWarnings("unchecked")
    public ApiResponse<DashboardResponse> getDashboard(@PathVariable Long accountId) {
        var dashboardData = dashboardService.getDashboard(accountId);

        DashboardResponse dashboard = DashboardResponse.builder()
                // Learning Stats
                .enrolledCourses((List<Map<String, Object>>) dashboardData.get("enrolledCourses"))
                .totalEnrolledCourses((Integer) dashboardData.get("totalEnrolledCourses"))
                .completedCourses((Integer) dashboardData.get("completedCourses"))
                .inProgressCourses((Integer) dashboardData.get("inProgressCourses"))
                .averageLearningProgress((Double) dashboardData.get("averageLearningProgress"))

                // Cart & Wishlist
                .cartItemCount((Integer) dashboardData.get("cartItemCount"))
                .wishlistItemCount((Integer) dashboardData.get("wishlistItemCount"))
                .cartItems((List<Map<String, Object>>) dashboardData.get("cartItems"))

                // Reviews
                .recentReviews((List<Map<String, Object>>) dashboardData.get("recentReviews"))
                .totalReviewsGiven((Integer) dashboardData.get("totalReviewsGiven"))
                .averageRating((Double) dashboardData.get("averageRating"))

                // Recommendations & Profile
                .recommendedCourses((List<Map<String, Object>>) dashboardData.get("recommendedCourses"))
                .learnerName((String) dashboardData.get("learnerName"))
                .learnerEmail((String) dashboardData.get("learnerEmail"))
                .profilePictureUrl((String) dashboardData.get("profilePictureUrl"))

                .build();

        return ApiResponse.success(dashboard, "Tải bảng điều khiển thành công");
    }
}

package com.elearning.apigateway.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.elearning.apigateway.client.CartServiceClient;
import com.elearning.apigateway.client.LearnerServiceClient;
import com.elearning.apigateway.service.DashboardService;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final LearnerServiceClient learnerServiceClient;
    private final CartServiceClient cartServiceClient;

    @Override
    public Map<String, Object> getDashboard(Long accountId) {
        log.info("BFF Service: Getting dashboard for accountId: {}", accountId);

        // Lấy dữ liệu từ các service
        var enrollments = learnerServiceClient.getEnrollments(accountId);
        var cartItems = cartServiceClient.getCart(accountId);
        var wishlistCount = learnerServiceClient.getWishlistCount(accountId);
        var reviews = learnerServiceClient.getMyReviews(accountId);
        var profile = learnerServiceClient.getProfile(accountId);

        // ===== Tính toán Learning Stats =====
        int totalEnrolled = enrollments != null ? ((java.util.List<?>) enrollments).size() : 0;
        int completed = 0;
        int inProgress = 0;
        double totalProgress = 0;

        if (enrollments != null && enrollments instanceof java.util.List) {
            for (Object enrollment : (java.util.List<?>) enrollments) {
                if (enrollment instanceof Map) {
                    Map<String, Object> e = (Map<String, Object>) enrollment;
                    String status = (String) e.get("status");
                    Object progressObj = e.get("progress");
                    double progress = 0;

                    if (progressObj instanceof Number) {
                        progress = ((Number) progressObj).doubleValue();
                    }
                    totalProgress += progress;

                    if ("COMPLETED".equals(status)) {
                        completed++;
                    } else if ("IN_PROGRESS".equals(status)) {
                        inProgress++;
                    }
                }
            }
        }

        double averageProgress = totalEnrolled > 0 ? totalProgress / totalEnrolled : 0;

        // ===== Tính toán Review Stats =====
        int totalReviews = reviews != null ? ((java.util.List<?>) reviews).size() : 0;
        double totalRating = 0;

        if (reviews != null && reviews instanceof java.util.List) {
            for (Object review : (java.util.List<?>) reviews) {
                if (review instanceof Map) {
                    Map<String, Object> r = (Map<String, Object>) review;
                    Object ratingObj = r.get("rating");
                    if (ratingObj instanceof Number) {
                        totalRating += ((Number) ratingObj).doubleValue();
                    }
                }
            }
        }

        double averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

        // ===== Gom dashboard data =====
        Map<String, Object> dashboard = new HashMap<>();

        // Enrolled Courses
        dashboard.put("enrolledCourses", enrollments);
        dashboard.put("totalEnrolledCourses", totalEnrolled);
        dashboard.put("completedCourses", completed);
        dashboard.put("inProgressCourses", inProgress);
        dashboard.put("averageLearningProgress", Math.round(averageProgress * 100.0) / 100.0);

        // Cart & Wishlist
        
        dashboard.put("wishlistItemCount", wishlistCount);
        dashboard.put("cartItems", cartItems);

        // Reviews
        dashboard.put("recentReviews", reviews);
        dashboard.put("totalReviewsGiven", totalReviews);
        dashboard.put("averageRating", Math.round(averageRating * 100.0) / 100.0);

        // Recommendations & Profile
        dashboard.put("recommendedCourses", new java.util.ArrayList<>());

        // Profile Info
        if (profile instanceof Map) {
            Map<String, Object> p = (Map<String, Object>) profile;
            dashboard.put("learnerName", p.get("name"));
            dashboard.put("learnerEmail", p.get("email"));
            dashboard.put("profilePictureUrl", p.get("profilePictureUrl"));
        }

        log.debug("BFF Service: Dashboard prepared - {} total, {} completed, {} reviews",
                totalEnrolled, completed, totalReviews);

        return dashboard;
    }
}


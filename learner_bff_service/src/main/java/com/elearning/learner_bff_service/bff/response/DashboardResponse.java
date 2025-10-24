package com.elearning.learner_bff_service.bff.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    // ===== Enrolled Courses Stats =====
    private List<Map<String, Object>> enrolledCourses;
    private Integer totalEnrolledCourses;
    private Integer completedCourses;
    private Integer inProgressCourses;
    private Double averageLearningProgress; // Trung bình tiến độ học

    // ===== Cart & Wishlist =====
    private Integer cartItemCount;
    private Integer wishlistItemCount;
    private List<Map<String, Object>> cartItems;
    private List<Map<String, Object>> wishlistItems;

    // ===== Learning Activity =====
    private List<Map<String, Object>> recentReviews;
    private Integer totalReviewsGiven;
    private Double averageRating; // Rating trung bình của các bài review

    // ===== Course Recommendations =====
    private List<Map<String, Object>> recommendedCourses;

    // ===== Personal Info =====
    private String learnerName;
    private String learnerEmail;
    private String profilePictureUrl;
}

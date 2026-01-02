package com.elearning.tutorservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response data for Tutor Pending Approvals API
 * API Endpoint: GET /api/v1/admin/dashboard/tutor-pending-approvals
 * Query Params: startDate (YYYY-MM-DD), endDate (YYYY-MM-DD)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorPendingApprovalsResponse {

    /** Total number of tutor approval requests in the period */
    private int total;

    /** Number of pending tutor approval requests */
    private int pending;

    /** Number of approved tutor requests */
    private int approved;

    /** Number of rejected tutor requests */
    private int rejected;

    /** Percentage of pending requests out of total */
    private double percentage;

    /** Weekly breakdown of tutor approval requests */
    private List<WeeklyData> weeklyData;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeeklyData {
        /** Date in YYYY-MM-DD format */
        private String date;

        /** Number of approved tutors on this date */
        private int approved;

        /** Number of pending tutors on this date */
        private int pending;

        /** Number of rejected tutors on this date */
        private int rejected;
    }
}
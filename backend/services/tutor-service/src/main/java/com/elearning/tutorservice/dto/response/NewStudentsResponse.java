package com.elearning.tutorservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response data for New Students API
 * API Endpoint: GET /api/v1/admin/dashboard/new-students
 * Query Params: startDate (YYYY-MM-DD), endDate (YYYY-MM-DD)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewStudentsResponse {

    /** Total number of new students registered in the period */
    private long totalNewStudents;

    /** Growth percentage compared to previous period (can be negative) */
    private double growthPercentage;

    /** Daily breakdown of new student registrations */
    private List<DailyData> dailyData;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyData {
        /** Date in YYYY-MM-DD format */
        private String date;

        /** Number of new students registered on this date */
        private long count;
    }
}
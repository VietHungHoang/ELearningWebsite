package com.elearning.tutorservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response data for New Tutors API
 * API Endpoint: GET /api/v1/admin/dashboard/new-tutors
 * Query Params: startDate (YYYY-MM-DD), endDate (YYYY-MM-DD)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewTutorsResponse {

    /** Total number of new tutors registered in the period */
    private long totalNewTutors;

    /** Growth percentage compared to previous period (can be negative) */
    private double growthPercentage;

    /** Daily breakdown of new tutor registrations */
    private List<DailyData> dailyData;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyData {
        /** Date in YYYY-MM-DD format */
        private String date;

        /** Number of new tutors registered on this date */
        private long count;
    }
}
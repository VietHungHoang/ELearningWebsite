package com.elearning.classservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompletedSessionsData {
    /* Total number of completed learning sessions in the period */
    private Long totalSessions;

    /* Growth percentage compared to previous period (can be negative) */
    private Double growthPercentage;

    /* Daily breakdown of completed sessions */
    private List<DailySessionData> dailyData;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailySessionData {
        /* Date in YYYY-MM-DD format */
        private String date;

        /* Day name abbreviation (T2, T3, ..., CN) */
        private String dayName;

        /* Number of completed sessions on this date */
        private Long sessions;
    }
}
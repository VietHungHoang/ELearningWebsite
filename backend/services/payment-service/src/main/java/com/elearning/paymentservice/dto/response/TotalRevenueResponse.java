package com.elearning.paymentservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Response data for Total Revenue API
 * API Endpoint: GET /api/v1/dashboard/total-revenue
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TotalRevenueResponse {

    /** Total revenue in the period */
    private BigDecimal totalRevenue;

    /** Growth percentage compared to previous period */
    private double growthPercentage;

    /** Daily breakdown of revenue */
    private List<DailyRevenue> dailyData;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyRevenue {
        /** Date in YYYY-MM-DD format */
        private String date;

        /** Revenue amount on this date */
        private BigDecimal amount;
    }
}

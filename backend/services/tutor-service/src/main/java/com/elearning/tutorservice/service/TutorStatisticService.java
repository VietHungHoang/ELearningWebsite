package com.elearning.tutorservice.service;

import com.elearning.tutorservice.dto.tutor_stats.response.TutorDashboardStatisticsResponse;
import com.elearning.tutorservice.dto.tutor_stats.response.MonthlyIncomeStats;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface TutorStatisticService {

    /**
     * Lấy thống kê dashboard của tutor trong khoảng thời gian
     */
    TutorDashboardStatisticsResponse getTutorStatistics(UUID tutorId, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Lấy thống kê thu nhập hàng tháng của tutor trong 12 tháng gần nhất
     */
    List<MonthlyIncomeStats> getMonthlyIncomeStats(UUID tutorId);
}

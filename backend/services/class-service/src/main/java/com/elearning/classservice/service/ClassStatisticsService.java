package com.elearning.classservice.service;

import com.elearning.classservice.dto.response.ClassStatisticsResponse;
import com.elearning.classservice.dto.response.MonthlyStudentStats;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ClassStatisticsService {

    /**
     * Lấy thống kê số học sinh của tutor trong khoảng thời gian
     */
    ClassStatisticsResponse getStudentStats(UUID tutorId, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Lấy thống kê số học sinh hàng tháng của tutor trong 12 tháng gần nhất
     */
    List<MonthlyStudentStats> getMonthlyStudentStats(UUID tutorId);
}

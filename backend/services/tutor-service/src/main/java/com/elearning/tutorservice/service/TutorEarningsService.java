package com.elearning.tutorservice.service;

import com.elearning.tutorservice.dto.event.SessionStartedEvent;
import com.elearning.tutorservice.dto.tutor_earnings.response.TutorEarningsResponse;
import com.elearning.tutorservice.dto.tutor_earnings.response.TutorEarningsStatsResponse;
import com.elearning.tutorservice.entity.enums.ClassType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface TutorEarningsService {

    /**
     * Lấy tất cả earnings của một tutor với phân trang và lọc theo class type (optional)
     */
    Page<TutorEarningsResponse> getEarningsByTutorId(UUID tutorId, ClassType classType, Pageable pageable);

    /**
     * Lấy tổng kết thu nhập của tutor
     */
    TutorEarningsStatsResponse getEarningsStatsByTutorId(UUID tutorId);

    /**
     * Create earnings record when session starts
     * Called from Kafka consumer when receiving SessionStartedEvent
     */
    void createEarningsFromSessionStart(SessionStartedEvent event);
}

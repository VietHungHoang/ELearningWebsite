package com.elearning.classservice.service;

import com.elearning.classservice.dto.response.CompletedSessionsData;

import java.time.LocalDate;

public interface AdminService {

    /**
     * Get completed sessions data for admin dashboard
     * @param startDate Start date (inclusive)
     * @param endDate End date (inclusive)
     * @return Completed sessions statistics
     */
    CompletedSessionsData getCompletedSessionsData(LocalDate startDate, LocalDate endDate);
}
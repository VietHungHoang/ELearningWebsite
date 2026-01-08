package com.elearning.paymentservice.service;

import com.elearning.paymentservice.dto.response.TotalRevenueResponse;

import java.time.LocalDate;

public interface DashboardService {
    TotalRevenueResponse getTotalRevenue(LocalDate startDate, LocalDate endDate);
}

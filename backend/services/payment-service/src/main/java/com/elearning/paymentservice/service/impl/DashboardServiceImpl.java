package com.elearning.paymentservice.service.impl;

import com.elearning.paymentservice.dto.response.TotalRevenueResponse;
import com.elearning.paymentservice.enums.PaymentStatus;
import com.elearning.paymentservice.repository.PaymentTransactionRepository;
import com.elearning.paymentservice.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

        private final PaymentTransactionRepository paymentTransactionRepository;

        @Override
        public TotalRevenueResponse getTotalRevenue(LocalDate startDate, LocalDate endDate) {
                log.info("Getting total revenue data from {} to {}", startDate, endDate);

                LocalDateTime startDateTime = startDate.atStartOfDay();
                LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

                // Get total revenue in the period
                BigDecimal totalRevenue = paymentTransactionRepository.sumAmountByStatusAndCreatedAtBetween(
                                PaymentStatus.COMPLETED, startDateTime, endDateTime);

                // Calculate growth percentage compared to previous period
                LocalDateTime previousPeriodStart = startDateTime
                                .minusDays(endDate.toEpochDay() - startDate.toEpochDay() + 1);
                LocalDateTime previousPeriodEnd = startDateTime.minusNanos(1);

                BigDecimal previousPeriodRevenue = paymentTransactionRepository.sumAmountByStatusAndCreatedAtBetween(
                                PaymentStatus.COMPLETED, previousPeriodStart, previousPeriodEnd);

                double growthPercentage = 0.0;
                if (previousPeriodRevenue.compareTo(BigDecimal.ZERO) > 0) {
                        BigDecimal diff = totalRevenue.subtract(previousPeriodRevenue);
                        growthPercentage = diff.divide(previousPeriodRevenue, 4, RoundingMode.HALF_UP)
                                        .multiply(BigDecimal.valueOf(100))
                                        .doubleValue();
                }

                // Get daily data
                List<Object[]> rawDailyData = paymentTransactionRepository.findRevenueByDate(
                                PaymentStatus.COMPLETED, startDateTime, endDateTime);

                List<TotalRevenueResponse.DailyRevenue> dailyData = rawDailyData.stream()
                                .map(row -> {
                                        java.sql.Date sqlDate = (java.sql.Date) row[0];
                                        BigDecimal amount = (BigDecimal) row[1];
                                        return TotalRevenueResponse.DailyRevenue.builder()
                                                        .date(sqlDate.toLocalDate()
                                                                        .format(DateTimeFormatter.ISO_LOCAL_DATE))
                                                        .amount(amount)
                                                        .build();
                                })
                                .collect(Collectors.toList());

                // Fill in missing dates with 0 amount
                List<TotalRevenueResponse.DailyRevenue> completeDailyData = new ArrayList<>();
                LocalDate current = startDate;
                while (!current.isAfter(endDate)) {
                        String dateStr = current.format(DateTimeFormatter.ISO_LOCAL_DATE);
                        BigDecimal amount = dailyData.stream()
                                        .filter(d -> d.getDate().equals(dateStr))
                                        .map(TotalRevenueResponse.DailyRevenue::getAmount)
                                        .findFirst()
                                        .orElse(BigDecimal.ZERO);

                        completeDailyData.add(TotalRevenueResponse.DailyRevenue.builder()
                                        .date(dateStr)
                                        .amount(amount)
                                        .build());
                        current = current.plusDays(1);
                }

                return TotalRevenueResponse.builder()
                                .totalRevenue(totalRevenue)
                                .growthPercentage(growthPercentage)
                                .dailyData(completeDailyData)
                                .build();
        }
}

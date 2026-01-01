package com.elearning.classservice.service.impl;

import com.elearning.classservice.dto.response.CompletedSessionsData;
import com.elearning.classservice.repository.SessionRepository;
import com.elearning.classservice.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final SessionRepository sessionRepository;

    @Override
    @Transactional(readOnly = true)
    public CompletedSessionsData getCompletedSessionsData(LocalDate startDate, LocalDate endDate) {
        LocalDateTime currentTime = LocalDateTime.now();

        // Get total completed sessions in the period
        Long totalSessions = sessionRepository.countCompletedSessionsInDateRange(startDate, endDate, currentTime);

        // Calculate growth percentage compared to previous period
        Double growthPercentage = calculateGrowthPercentage(startDate, endDate, currentTime);

        // Get daily breakdown
        List<CompletedSessionsData.DailySessionData> dailyData = getDailyData(startDate, endDate, currentTime);

        return CompletedSessionsData.builder()
                .totalSessions(totalSessions)
                .growthPercentage(growthPercentage)
                .dailyData(dailyData)
                .build();
    }

    private Double calculateGrowthPercentage(LocalDate startDate, LocalDate endDate, LocalDateTime currentTime) {
        // Calculate the duration of the current period
        long days = ChronoUnit.DAYS.between(startDate, endDate) + 1;

        // Calculate previous period
        LocalDate previousStartDate = startDate.minusDays(days);
        LocalDate previousEndDate = endDate.minusDays(days);

        // Get sessions for previous period
        Long previousSessions = sessionRepository.countCompletedSessionsInDateRange(previousStartDate, previousEndDate, currentTime);

        // Get current sessions
        Long currentSessions = sessionRepository.countCompletedSessionsInDateRange(startDate, endDate, currentTime);

        if (previousSessions == 0) {
            return currentSessions > 0 ? 100.0 : 0.0;
        }

        return ((double) (currentSessions - previousSessions) / previousSessions) * 100.0;
    }

    private List<CompletedSessionsData.DailySessionData> getDailyData(LocalDate startDate, LocalDate endDate, LocalDateTime currentTime) {
        List<Object[]> results = sessionRepository.getDailyCompletedSessions(startDate, endDate, currentTime);
        List<CompletedSessionsData.DailySessionData> dailyData = new ArrayList<>();

        // Create a map of date to count for easier lookup
        // Fill in missing dates with 0
        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            String dateStr = current.format(DateTimeFormatter.ISO_LOCAL_DATE);
            String dayName = getVietnameseDayName(current);
            Long count = 0L;

            // Find count for this date
            for (Object[] result : results) {
                LocalDate resultDate = ((java.sql.Date) result[0]).toLocalDate();
                if (resultDate.equals(current)) {
                    count = (Long) result[1];
                    break;
                }
            }

            dailyData.add(CompletedSessionsData.DailySessionData.builder()
                    .date(dateStr)
                    .dayName(dayName)
                    .sessions(count)
                    .build());

            current = current.plusDays(1);
        }

        return dailyData;
    }

    private String getVietnameseDayName(LocalDate date) {
        // Monday = 1, Sunday = 7
        int dayOfWeek = date.getDayOfWeek().getValue();
        return switch (dayOfWeek) {
            case 1 -> "T2"; // Monday
            case 2 -> "T3"; // Tuesday
            case 3 -> "T4"; // Wednesday
            case 4 -> "T5"; // Thursday
            case 5 -> "T6"; // Friday
            case 6 -> "T7"; // Saturday
            case 7 -> "CN"; // Sunday
            default -> "";
        };
    }
}
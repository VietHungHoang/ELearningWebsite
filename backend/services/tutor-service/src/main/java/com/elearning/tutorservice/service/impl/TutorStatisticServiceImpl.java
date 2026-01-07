package com.elearning.tutorservice.service.impl;

import com.elearning.tutorservice.dto.tutor_stats.response.TutorDashboardStatisticsResponse;
import com.elearning.tutorservice.dto.tutor_stats.response.MonthlyIncomeStats;
import com.elearning.tutorservice.dto.tutor_stats.response.MonthlyStudentStats;
import com.elearning.tutorservice.dto.tutor_stats.response.TutorChartsDataResponse;
import com.elearning.tutorservice.entity.Tutor;
import com.elearning.tutorservice.repository.TutorEarningsRepository;
import com.elearning.tutorservice.repository.TutorReviewRepository;
import com.elearning.tutorservice.repository.TutorRepository;
import com.elearning.tutorservice.repository.StudentOfTutorRepository;
import com.elearning.tutorservice.service.TutorStatisticService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TutorStatisticServiceImpl implements TutorStatisticService {

    private final TutorEarningsRepository tutorEarningsRepository;
    private final TutorReviewRepository tutorReviewRepository;
    private final TutorRepository tutorRepository;
    private final StudentOfTutorRepository studentOfTutorRepository;

    @Override
    @Transactional(readOnly = true)
    public TutorDashboardStatisticsResponse getTutorStatistics(UUID tutorId, LocalDateTime startDate,
            LocalDateTime endDate) {
        // Use reasonable default dates instead of LocalDateTime.MIN/MAX to avoid
        // PostgreSQL timestamp range errors
        LocalDateTime effectiveStartDate = startDate != null ? startDate : LocalDateTime.of(2000, 1, 1, 0, 0);
        LocalDateTime effectiveEndDate = endDate != null ? endDate : LocalDateTime.now().plusDays(1);

        Long teachingHours = tutorEarningsRepository.countTeachingHoursByTutorAndDateRange(tutorId, effectiveStartDate,
                effectiveEndDate);
        BigDecimal totalEarnings = tutorEarningsRepository.getTotalEarningsByTutorAndDateRange(tutorId,
                effectiveStartDate, effectiveEndDate);
        Long newReviews = tutorReviewRepository.countNewReviewsByTutorAndDateRange(tutorId, effectiveStartDate,
                effectiveEndDate);
        Integer totalStudents = tutorRepository.findById(tutorId)
                .map(Tutor::getTotalStudents)
                .orElse(0);

        return TutorDashboardStatisticsResponse.builder()
                .teachingHours(teachingHours)
                .totalEarnings(totalEarnings)
                .newReviews(newReviews)
                .totalStudents(totalStudents.longValue())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MonthlyIncomeStats> getMonthlyIncomeStats(UUID tutorId) {
        LocalDateTime startDate = LocalDateTime.now().minusMonths(12);
        List<Object[]> results = tutorEarningsRepository.getMonthlyIncomeStats(tutorId, startDate);

        return results.stream()
                .map(row -> {
                    Integer year = (Integer) row[0];
                    Integer month = (Integer) row[1];
                    BigDecimal income = (BigDecimal) row[2];
                    String monthStr = String.format("%04d-%02d", year, month);
                    return MonthlyIncomeStats.builder()
                            .month(monthStr)
                            .income(income)
                            .build();
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MonthlyStudentStats> getMonthlyStudentStats(UUID tutorId) {
        LocalDateTime startDate = LocalDateTime.now().minusMonths(12);
        List<Object[]> results = studentOfTutorRepository.getMonthlyStudentStats(tutorId, startDate);

        return results.stream()
                .map(row -> {
                    Integer year = (Integer) row[0];
                    Integer month = (Integer) row[1];
                    Long students = (Long) row[2];
                    String monthStr = String.format("%04d-%02d", year, month);
                    return MonthlyStudentStats.builder()
                            .month(monthStr)
                            .students(students)
                            .build();
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TutorChartsDataResponse getChartsData(UUID tutorId) {
        List<MonthlyIncomeStats> incomes = getMonthlyIncomeStats(tutorId);
        List<MonthlyStudentStats> students = getMonthlyStudentStats(tutorId);

        return TutorChartsDataResponse.builder()
                .incomes(incomes)
                .students(students)
                .build();
    }
}

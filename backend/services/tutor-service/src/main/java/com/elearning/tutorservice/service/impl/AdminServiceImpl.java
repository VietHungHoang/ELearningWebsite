package com.elearning.tutorservice.service.impl;

import com.elearning.tutorservice.dto.response.NewStudentsResponse;
import com.elearning.tutorservice.dto.response.NewTutorsResponse;
import com.elearning.tutorservice.dto.response.TutorPendingApprovalsResponse;
import com.elearning.tutorservice.entity.enums.OnboardingStatus;
import com.elearning.tutorservice.repository.StudentOfTutorRepository;
import com.elearning.tutorservice.repository.TutorOnboardingRepository;
import com.elearning.tutorservice.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Helper to convert SQL Date to LocalDate
 */

/**
 * Implementation of AdminService
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

        private final TutorOnboardingRepository tutorOnboardingRepository;
        private final StudentOfTutorRepository studentOfTutorRepository;

        /**
         * Convert SQL Date/LocalDate to LocalDate
         */
        private LocalDate toLocalDate(Object dateObj) {
                if (dateObj instanceof LocalDate) {
                        return (LocalDate) dateObj;
                } else if (dateObj instanceof java.sql.Date) {
                        return ((java.sql.Date) dateObj).toLocalDate();
                } else if (dateObj instanceof java.util.Date) {
                        return ((java.util.Date) dateObj).toInstant()
                                        .atZone(java.time.ZoneId.systemDefault())
                                        .toLocalDate();
                }
                throw new IllegalArgumentException("Cannot convert " + dateObj.getClass().getName() + " to LocalDate");
        }

        @Override
        public TutorPendingApprovalsResponse getTutorPendingApprovals(LocalDate startDate, LocalDate endDate) {
                log.info("Getting tutor pending approvals data from {} to {}", startDate, endDate);

                // Get counts
                long total = tutorOnboardingRepository.countByStatusAndCreatedAtBetween(OnboardingStatus.PENDING,
                                startDate, endDate) +
                                tutorOnboardingRepository.countByStatusAndCreatedAtBetween(OnboardingStatus.APPROVED,
                                                startDate, endDate)
                                +
                                tutorOnboardingRepository.countByStatusAndCreatedAtBetween(OnboardingStatus.REJECTED,
                                                startDate, endDate);

                long pending = tutorOnboardingRepository.countByStatusAndCreatedAtBetween(OnboardingStatus.PENDING,
                                startDate, endDate);
                long approved = tutorOnboardingRepository.countByStatusAndCreatedAtBetween(OnboardingStatus.APPROVED,
                                startDate, endDate);
                long rejected = tutorOnboardingRepository.countByStatusAndCreatedAtBetween(OnboardingStatus.REJECTED,
                                startDate, endDate);

                double percentage = total > 0 ? (double) pending / total * 100 : 0.0;

                // Get weekly data
                List<Object[]> rawData = tutorOnboardingRepository.findWeeklyStats(startDate, endDate);
                Map<LocalDate, Map<OnboardingStatus, Long>> groupedData = rawData.stream()
                                .collect(Collectors.groupingBy(
                                                row -> toLocalDate(row[0]),
                                                Collectors.toMap(
                                                                row -> (OnboardingStatus) row[1],
                                                                row -> (Long) row[2],
                                                                (a, b) -> a)));

                List<TutorPendingApprovalsResponse.WeeklyData> weeklyData = new ArrayList<>();
                LocalDate current = startDate;
                while (!current.isAfter(endDate)) {
                        Map<OnboardingStatus, Long> dayData = groupedData.getOrDefault(current, Collections.emptyMap());
                        weeklyData.add(TutorPendingApprovalsResponse.WeeklyData.builder()
                                        .date(current.format(DateTimeFormatter.ISO_LOCAL_DATE))
                                        .approved(dayData.getOrDefault(OnboardingStatus.APPROVED, 0L).intValue())
                                        .pending(dayData.getOrDefault(OnboardingStatus.PENDING, 0L).intValue())
                                        .rejected(dayData.getOrDefault(OnboardingStatus.REJECTED, 0L).intValue())
                                        .build());
                        current = current.plusDays(1);
                }

                return TutorPendingApprovalsResponse.builder()
                                .total((int) total)
                                .pending((int) pending)
                                .approved((int) approved)
                                .rejected((int) rejected)
                                .percentage(percentage)
                                .weeklyData(weeklyData)
                                .build();
        }

        @Override
        public NewStudentsResponse getNewStudents(LocalDate startDate, LocalDate endDate) {
                log.info("Getting new students data from {} to {}", startDate, endDate);

                // Get total new students in the period
                long totalNewStudents = studentOfTutorRepository.countByCreatedAtBetween(startDate, endDate);

                // Calculate growth percentage compared to previous period
                LocalDate previousPeriodStart = startDate.minusDays(endDate.toEpochDay() - startDate.toEpochDay() + 1);
                LocalDate previousPeriodEnd = startDate.minusDays(1);
                long previousPeriodCount = studentOfTutorRepository.countByCreatedAtBetween(previousPeriodStart,
                                previousPeriodEnd);
                double growthPercentage = previousPeriodCount > 0
                                ? ((double) (totalNewStudents - previousPeriodCount) / previousPeriodCount) * 100
                                : 0.0;

                // Get daily data
                List<Object[]> rawDailyData = studentOfTutorRepository.findDailyNewStudents(startDate, endDate);
                List<NewStudentsResponse.DailyData> dailyData = rawDailyData.stream()
                                .map(row -> {
                                        LocalDate date = toLocalDate(row[0]);
                                        Long count = (Long) row[1];
                                        return NewStudentsResponse.DailyData.builder()
                                                        .date(date.format(DateTimeFormatter.ISO_LOCAL_DATE))
                                                        .count(count)
                                                        .build();
                                })
                                .collect(Collectors.toList());

                // Fill in missing dates with 0 counts
                List<NewStudentsResponse.DailyData> completeDailyData = new ArrayList<>();
                LocalDate current = startDate;
                while (!current.isAfter(endDate)) {
                        String dateStr = current.format(DateTimeFormatter.ISO_LOCAL_DATE);
                        long count = dailyData.stream()
                                        .filter(d -> d.getDate().equals(dateStr))
                                        .mapToLong(NewStudentsResponse.DailyData::getCount)
                                        .findFirst()
                                        .orElse(0L);
                        completeDailyData.add(NewStudentsResponse.DailyData.builder()
                                        .date(dateStr)
                                        .count(count)
                                        .build());
                        current = current.plusDays(1);
                }

                return NewStudentsResponse.builder()
                                .totalNewStudents(totalNewStudents)
                                .growthPercentage(growthPercentage)
                                .dailyData(completeDailyData)
                                .build();
        }

        @Override
        public NewTutorsResponse getNewTutors(LocalDate startDate, LocalDate endDate) {
                log.info("Getting new tutors data from {} to {}", startDate, endDate);

                // Get total new tutors in the period
                long totalNewTutors = tutorOnboardingRepository.countByCreatedAtBetween(startDate, endDate);

                // Calculate growth percentage compared to previous period
                LocalDate previousPeriodStart = startDate.minusDays(endDate.toEpochDay() - startDate.toEpochDay() + 1);
                LocalDate previousPeriodEnd = startDate.minusDays(1);
                long previousPeriodCount = tutorOnboardingRepository.countByCreatedAtBetween(previousPeriodStart,
                                previousPeriodEnd);
                double growthPercentage = previousPeriodCount > 0
                                ? ((double) (totalNewTutors - previousPeriodCount) / previousPeriodCount) * 100
                                : 0.0;

                // Get daily data
                List<Object[]> rawDailyData = tutorOnboardingRepository.findDailyNewTutors(startDate, endDate);
                List<NewTutorsResponse.DailyData> dailyData = rawDailyData.stream()
                                .map(row -> {
                                        LocalDate date = toLocalDate(row[0]);
                                        Long count = (Long) row[1];
                                        return NewTutorsResponse.DailyData.builder()
                                                        .date(date.format(DateTimeFormatter.ISO_LOCAL_DATE))
                                                        .count(count)
                                                        .build();
                                })
                                .collect(Collectors.toList());

                // Fill in missing dates with 0 counts
                List<NewTutorsResponse.DailyData> completeDailyData = new ArrayList<>();
                LocalDate current = startDate;
                while (!current.isAfter(endDate)) {
                        String dateStr = current.format(DateTimeFormatter.ISO_LOCAL_DATE);
                        long count = dailyData.stream()
                                        .filter(d -> d.getDate().equals(dateStr))
                                        .mapToLong(NewTutorsResponse.DailyData::getCount)
                                        .findFirst()
                                        .orElse(0L);
                        completeDailyData.add(NewTutorsResponse.DailyData.builder()
                                        .date(dateStr)
                                        .count(count)
                                        .build());
                        current = current.plusDays(1);
                }

                return NewTutorsResponse.builder()
                                .totalNewTutors(totalNewTutors)
                                .growthPercentage(growthPercentage)
                                .dailyData(completeDailyData)
                                .build();
        }
}
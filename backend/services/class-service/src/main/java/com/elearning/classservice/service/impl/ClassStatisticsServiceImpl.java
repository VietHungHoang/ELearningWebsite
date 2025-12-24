package com.elearning.classservice.service.impl;

import com.elearning.classservice.dto.response.ClassStatisticsResponse;
import com.elearning.classservice.dto.response.MonthlyStudentStats;
import com.elearning.classservice.repository.ClassEnrollmentRepository;
import com.elearning.classservice.service.ClassStatisticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClassStatisticsServiceImpl implements ClassStatisticsService {

    private final ClassEnrollmentRepository classEnrollmentRepository;

    @Override
    @Transactional(readOnly = true)
    public ClassStatisticsResponse getStudentStats(UUID tutorId, LocalDateTime startDate, LocalDateTime endDate) {
        LocalDateTime effectiveStartDate = startDate != null ? startDate : LocalDateTime.of(2000, 1, 1, 0, 0);
        LocalDateTime effectiveEndDate = endDate != null ? endDate : LocalDateTime.now();

        Long totalStudents = classEnrollmentRepository.countDistinctStudentsByTutorIdAndDateRange(tutorId, effectiveStartDate, effectiveEndDate);

        return ClassStatisticsResponse.builder()
                .totalStudents(totalStudents)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MonthlyStudentStats> getMonthlyStudentStats(UUID tutorId) {
        LocalDateTime startDate = LocalDateTime.now().minusMonths(12);
        List<Object[]> results = classEnrollmentRepository.getMonthlyStudentStats(tutorId, startDate);

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
}

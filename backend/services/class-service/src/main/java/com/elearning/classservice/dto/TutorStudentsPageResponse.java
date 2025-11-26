package com.elearning.classservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Paginated response for tutor students list
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorStudentsPageResponse {
    private List<com.elearning.classservice.dto.response.TutorStudentResponse> students;
    private int currentPage;
    private int totalPages;
    private long totalElements;
    private int pageSize;
    private boolean hasNext;
    private boolean hasPrevious;
    private boolean isFirst;
    private boolean isLast;

    // Tutor earnings summary
    private BigDecimal totalEarnings;
    private BigDecimal pendingEarnings;
    private Long totalCompletedSessions;
}
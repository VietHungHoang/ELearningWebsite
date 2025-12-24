package com.elearning.bffservice.bff.tutors.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import com.elearning.bffservice.dto.request.ClassType;

/**
 * Request DTO for searching tutors
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorSearchBffRequest {

    // Search filters
    private List<String> languageCodes;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private UUID categoryId;
    private UUID subjectId;
    private ClassType classType;

    // Availability
    private List<String> availableDays;

    // Pagination
    @Builder.Default
    private int page = 0;

    @Builder.Default
    private int size = 10;

    // Student context for filtering
    private UUID studentId;
}
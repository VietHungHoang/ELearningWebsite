package com.elearning.bffservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO cho mỗi availability slot trong bulk update request (BFF layer)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityInput {
    
    private Integer dayOfWeek;
    private String startTime;
    private String endTime;
    private LocalDate effectiveStartDate;
    private LocalDate effectiveEndDate;
    private String status; // "AVAILABLE" or "DELETED"
}

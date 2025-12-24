package com.elearning.tutorservice.dto.tutor_stats.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyIncomeStats {
    private String month; // e.g., "2023-12"
    private BigDecimal income;
}
package com.elearning.tutorservice.dto.tutor_stats.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorMonthlyIncomeResponse {
    private List<MonthlyIncomeStats> incomes;
}
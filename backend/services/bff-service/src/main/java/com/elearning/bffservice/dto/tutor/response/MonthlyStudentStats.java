package com.elearning.bffservice.dto.tutor.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyStudentStats {
    private String month; // e.g., "2023-12"
    private Long students;
}
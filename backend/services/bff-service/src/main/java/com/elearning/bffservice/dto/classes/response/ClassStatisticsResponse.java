package com.elearning.bffservice.dto.classes.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassStatisticsResponse {
    private Long totalStudents;
}

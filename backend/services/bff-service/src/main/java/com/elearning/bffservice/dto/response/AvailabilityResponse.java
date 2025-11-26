package com.elearning.bffservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityResponse {
    private UUID id;
    private Integer dayOfWeek;
    private String startTime;
    private String endTime;
    private LocalDate effectiveStartDate;
    private LocalDate effectiveEndDate;
    private String status;
}

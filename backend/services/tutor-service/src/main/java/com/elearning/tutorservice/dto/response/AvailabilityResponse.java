package com.elearning.tutorservice.dto.response;

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
    private String startTime; // HH:mm format
    private String endTime; // HH:mm format
    private LocalDate effectiveStartDate;
    private LocalDate effectiveEndDate;
}

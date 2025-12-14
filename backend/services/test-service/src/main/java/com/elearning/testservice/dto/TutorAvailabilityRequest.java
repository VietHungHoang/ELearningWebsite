package com.elearning.testservice.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class TutorAvailabilityRequest {
    private Short dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDate effectiveStartDate;
    private LocalDate effectiveEndDate;
    private String status;
}
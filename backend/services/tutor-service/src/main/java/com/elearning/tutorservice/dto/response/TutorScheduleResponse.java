package com.elearning.tutorservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorScheduleResponse {
    private Long tutorId;
    private Long availabilityId;
    private Short dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDate effectiveStartDate;
    private LocalDate effectiveEndDate;
    private String status;
}
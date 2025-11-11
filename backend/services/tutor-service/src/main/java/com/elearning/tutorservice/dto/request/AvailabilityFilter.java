package com.elearning.tutorservice.dto.request;

import lombok.Data;

import java.time.LocalTime;

@Data
public class AvailabilityFilter {
    private Short dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
}
package com.elearning.tutorservice.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO cho availability schedule input
 * Format theo yêu cầu của user
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityScheduleInput {

    /**
     * Ngày trong tuần (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
     */
    @NotNull(message = "Day of week is required")
    @Min(value = 0, message = "Day of week must be between 0 and 6")
    @Max(value = 6, message = "Day of week must be between 0 and 6")
    private Integer dayOfWeek;

    /**
     * Giờ bắt đầu (format: HH:mm:ss)
     */
    @NotNull(message = "Start time is required")
    private String startTime;

    /**
     * Giờ kết thúc (format: HH:mm:ss)
     */
    @NotNull(message = "End time is required")
    private String endTime;

    /**
     * Ngày bắt đầu có hiệu lực (format: YYYY-MM-DD)
     */
    @NotNull(message = "Effective start date is required")
    private LocalDate effectiveStartDate;
}
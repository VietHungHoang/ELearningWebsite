package com.elearning.tutorservice.dto.request;

import com.elearning.tutorservice.entity.AvailabilityStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO cho mỗi availability slot trong bulk update request
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityInput {
    
    /**
     * Ngày trong tuần (1 = Monday, 7 = Sunday)
     */
    @NotNull(message = "Day of week is required")
    @Min(value = 1, message = "Day of week must be between 1 and 7")
    @Max(value = 7, message = "Day of week must be between 1 and 7")
    private Integer dayOfWeek;
    
    /**
     * Giờ bắt đầu (format: HH:mm)
     */
    @NotNull(message = "Start time is required")
    private String startTime;
    
    /**
     * Giờ kết thúc (format: HH:mm)
     */
    @NotNull(message = "End time is required")
    private String endTime;
    
    /**
     * Ngày bắt đầu có hiệu lực
     */
    @NotNull(message = "Effective start date is required")
    private LocalDate effectiveStartDate;
    
    /**
     * Ngày kết thúc có hiệu lực (null = vô hạn)
     */
    private LocalDate effectiveEndDate;
    
    /**
     * Trạng thái (AVAILABLE hoặc DELETED)
     */
    @NotNull(message = "Status is required")
    private AvailabilityStatus status;
}

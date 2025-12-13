package com.elearning.tutorservice.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request DTO cho update availability schedule
 * Nhận danh sách availability slots mới
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAvailabilityScheduleRequest {

    /**
     * Danh sách availability slots mới
     */
    @Valid
    @NotNull(message = "Availabilities is required")
    private List<AvailabilityScheduleInput> availabilities;
}
package com.elearning.bffservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Request DTO cho bulk update availability (BFF layer)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkUpdateAvailabilityRequest {
    
    private String mode; // "this_period" or "recurring"
    private LocalDate startDate;
    private LocalDate endDate;
    private List<UUID> oldAvailabilityIds;
    private List<AvailabilityInput> newAvailabilities;
}

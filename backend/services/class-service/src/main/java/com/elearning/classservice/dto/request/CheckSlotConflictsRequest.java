package com.elearning.classservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Request for checking slot conflicts
 * Used to find both tutor and student busy slots in a date range
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckSlotConflictsRequest {
    private UUID tutorId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
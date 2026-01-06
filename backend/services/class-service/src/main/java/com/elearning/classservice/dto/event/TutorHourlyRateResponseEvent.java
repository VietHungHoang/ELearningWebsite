package com.elearning.classservice.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Kafka event response containing tutor hourly rate from tutor-service
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorHourlyRateResponseEvent {

    private UUID classId;
    private UUID tutorId;
    private BigDecimal hourlyRate;
}

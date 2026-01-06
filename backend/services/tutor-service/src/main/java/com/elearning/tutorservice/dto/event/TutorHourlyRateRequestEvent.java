package com.elearning.tutorservice.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Kafka event to request tutor hourly rate from class-service
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorHourlyRateRequestEvent {

    private UUID classId;
    private UUID tutorId;
}

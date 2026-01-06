package com.elearning.classservice.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Kafka event to request tutor hourly rate from tutor-service
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorHourlyRateRequestEvent {

    private UUID classId;
    private UUID tutorId;
}

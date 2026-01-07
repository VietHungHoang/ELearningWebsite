package com.elearning.classservice.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Event sent to booking-service when a class is created or updated
 * Topic: class_created_booking
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassCreatedEvent {

    private UUID bookingId;
    private UUID classId;
    private String title;
    private String classType;
}

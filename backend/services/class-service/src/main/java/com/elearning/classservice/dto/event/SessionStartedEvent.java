package com.elearning.classservice.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Kafka event published when a session starts
 * Consumed by:
 * - Notification service: to send notifications to students
 * - Tutor service: to create earnings record
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionStartedEvent {
    
    private UUID sessionId;
    
    private UUID tutorId;
    
    private List<UUID> studentIds;
    
    private String zoomJoinUrl;
    
    private LocalDateTime startTime;
    
    private LocalDateTime endTime;
    
    private String sessionTitle;
    
    private Boolean isTrial;
    
    // Additional fields for TutorEarnings
    private BigDecimal pricePerHour;
    
    private String classType; // ONE_ON_ONE, GROUP
    
    private UUID classId;
    
    private String className; // Title of the class
    
    private String studentName; // Name of the student (for ONE_ON_ONE)
}

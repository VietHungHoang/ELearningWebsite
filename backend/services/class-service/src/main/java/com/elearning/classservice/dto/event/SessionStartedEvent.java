package com.elearning.classservice.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Kafka event published when a session starts
 * Notification service will consume this to send notifications to students
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
}

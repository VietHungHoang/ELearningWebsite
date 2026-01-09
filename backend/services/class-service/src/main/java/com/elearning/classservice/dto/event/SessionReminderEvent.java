package com.elearning.classservice.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Event sent to notification-service 15 minutes before a session starts
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionReminderEvent {

    private UUID sessionId;
    private UUID classId;
    private String classTitle;

    private UUID tutorId;
    private String tutorName;
    private String tutorEmail;

    private UUID studentId;
    private String studentName;
    private String studentEmail;

    private LocalDateTime sessionStartTime;
    private LocalDateTime sessionEndTime;
    private Integer sessionNumber;

    private String zoomJoinUrl; // Optional: for quick access
}

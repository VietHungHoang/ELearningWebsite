package com.elearning.classservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for session information in tutor student response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionInfo {
    private UUID sessionId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private Boolean isTrial;
    private String attendanceStatus;
}
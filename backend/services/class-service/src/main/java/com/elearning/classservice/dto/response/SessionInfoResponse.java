package com.elearning.classservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for session information in tutor-student relationship
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionInfoResponse {
    private UUID sessionId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private Boolean isTrial;
    private String attendanceStatus;
}
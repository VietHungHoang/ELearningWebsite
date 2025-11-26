package com.elearning.bffservice.dto.response;

import com.elearning.bffservice.dto.response.enums.ScheduleStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Response from class-service for booked sessions (without student details)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassServiceBookedSessionResponse {
    private UUID id;
    private UUID studentId;
    private LocalDateTime sessionDatetime;
    private Integer durationMinutes;
    private String className;
    private String sessionType;
    private ScheduleStatus status;
    private String meetingUrl;
    private String notes;
    private LocalDateTime bookedAt;
    private LocalDateTime updatedAt;
}

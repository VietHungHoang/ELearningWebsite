package com.elearning.bffservice.dto.clas.response;

import com.elearning.bffservice.dto.enums.ScheduleStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrialSessionRequestResponse {
    private UUID id;
    private LocalDateTime sessionDateTime;
    private String message;
    private ScheduleStatus status;
    private UUID studentId;
    private UUID tutorId;
    private UUID sessionId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
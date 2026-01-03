package com.elearning.classservice.dto.response;

import com.elearning.classservice.entity.enums.RequestStatus;
import com.elearning.classservice.entity.enums.RequestTargetType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for reschedule request response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RescheduleRequestResponse {
    private UUID id;
    private UUID sessionId;
    private UUID classId;
    private RequestTargetType targetType; // SESSION or CLASS
    private UUID requesterId;
    private String requesterName;
    private LocalDateTime oldSchedule;
    private LocalDateTime newSchedule;
    private String reason;
    private RequestStatus status; // PENDING, APPROVED, REJECTED
    private LocalDateTime createdAt;
}
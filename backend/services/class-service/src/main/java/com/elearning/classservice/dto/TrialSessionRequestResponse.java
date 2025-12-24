package com.elearning.classservice.dto;

import com.elearning.classservice.dto.response.UserInfoResponse;
import com.elearning.classservice.entity.enums.ScheduleStatus;
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
    private UserInfoResponse student;
    private UserInfoResponse tutor;
    private ScheduleStatus status;
    private UUID sessionId;
    private LocalDateTime createdAt;
}

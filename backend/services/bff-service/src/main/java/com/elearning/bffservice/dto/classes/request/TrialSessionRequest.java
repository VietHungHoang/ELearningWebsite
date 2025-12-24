package com.elearning.bffservice.dto.classes.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrialSessionRequest {
    private UUID tutorId;
    private UUID studentId;
    private LocalDateTime sessionDateTime;
    private String message;
}
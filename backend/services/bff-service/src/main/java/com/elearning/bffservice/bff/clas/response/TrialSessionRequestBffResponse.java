package com.elearning.bffservice.bff.clas.response;

import com.elearning.bffservice.dto.student.response.StudentResponse;
import com.elearning.bffservice.dto.enums.ScheduleStatus;
import com.elearning.bffservice.dto.tutor.response.TutorResponse;

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
public class TrialSessionRequestBffResponse {
    private UUID id;
    private LocalDateTime sessionDateTime;
    private String message;
    private ScheduleStatus status;
    private UUID sessionId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private TutorResponse tutor;
    private StudentResponse student;
}
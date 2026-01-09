package com.elearning.classservice.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewStudentEnrollmentNotificationEvent {
    private UUID tutorId;
    private String tutorEmail;
    private String tutorName;
    private UUID studentId;
    private String studentName;
    private UUID classId;
    private String classTitle;
}


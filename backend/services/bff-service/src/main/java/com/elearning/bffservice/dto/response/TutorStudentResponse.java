package com.elearning.bffservice.dto.response;

import com.elearning.bffservice.dto.response.SessionInfoResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Tutor student response from Class Service
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorStudentResponse {
    
    private UUID studentId;
    private StudentType studentType;
    private UUID classId;
    private String classTitle;
    private String classType;
    private String enrollmentStatus;
    private String paymentStatus;
    private LocalDateTime enrolledAt;
    private List<SessionInfoResponse> sessions;
    private Integer totalSessionsAttended;
    private Integer totalSessionsScheduled;
    
    public enum StudentType {
        ONE_ON_ONE,
        GROUP,
        TRIAL
    }
}

package com.elearning.classservice.dto.response;

import com.elearning.classservice.entity.enums.ClassType;
import com.elearning.classservice.entity.enums.StudentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * DTO to return tutor student information with status
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorStudentResponse {
    
    private UUID studentId;

    /** 
     * Student type/status (ONE_ON_ONE, GROUP, TRIAL)
     */
    private StudentType studentType;
    
    /** 
     * Class information (if any)
    */
    private UUID classId;
    private String classTitle;
    private ClassType classType;
    
    private String enrollmentStatus;
    private String paymentStatus;
    private LocalDateTime enrolledAt;
    
    /** 
     * Session history (list of all sessions with this tutor)
     */
    private List<SessionInfoResponse> sessions;
    private Integer totalSessionsAttended;
    private Integer totalSessionsScheduled;
    

}

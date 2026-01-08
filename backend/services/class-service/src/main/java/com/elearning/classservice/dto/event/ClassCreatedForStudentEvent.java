package com.elearning.classservice.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Event sent to student-service (or tutor-service) when a NEW class is created
 * to increment totalStudents count for the tutor
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassCreatedForStudentEvent {
    
    private String classId;
    private String tutorId;
    private String studentId;
    private String classType; // ONE_ON_ONE or GROUP
}

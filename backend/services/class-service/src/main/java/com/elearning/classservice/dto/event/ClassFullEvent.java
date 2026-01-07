package com.elearning.classservice.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

/**
 * Event sent when a class reaches maximum capacity and is ready for payment
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassFullEvent {

    /**
     * Event type for notification service routing
     */
    private String eventType;

    /**
     * Class ID
     */
    private UUID classId;

    /**
     * Class title
     */
    private String classTitle;

    /**
     * Price per hour for the class
     */
    private Double pricePerHour;

    /**
     * Tutor information
     */
    private TutorInfo tutor;

    /**
     * List of enrolled students
     */
    private List<StudentInfo> students;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TutorInfo {
        private UUID id;
        private String fullName;
        private String email;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentInfo {
        private UUID id;
        private String fullName;
        private String email;
    }
}

package com.elearning.classservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Response for tutor's classes list
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorClassResponse {
    
    private UUID id;
    private String courseTitle;
    private List<StudentInfo> students;
    private String type; // "1-on-1", "Group"
    private String status; // "Ongoing", "Completed"
    private List<ScheduleInfo> schedules;
    private String startDate; // formatted: "Oct 1, 2025"
    private Integer completedSessions;
    private Integer totalSessions;
    private List<QuizInfo> quizzes; // Empty for now
    private List<MaterialInfo> materials;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentInfo {
        private UUID id;
        private String name; // Will be populated by BFF
        private String avatar; // Will be populated by BFF
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScheduleInfo {
        private String day; // "Monday", "Wednesday"
        private String time; // "10:00 AM"
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuizInfo {
        private UUID id;
        private String title;
        private String status;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MaterialInfo {
        private UUID id;
        private String name;
        private String type;
        private LocalDate date;
    }
}

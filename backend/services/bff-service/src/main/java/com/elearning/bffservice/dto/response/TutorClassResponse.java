package com.elearning.bffservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * DTOs mirroring Class Service class response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorClassResponse {
    
    private UUID id;
    private String courseTitle;
    private List<StudentInfo> students;
    private String type;
    private String status;
    private List<ScheduleInfo> schedules;
    private String startDate;
    private Integer completedSessions;
    private Integer totalSessions;
    private List<QuizInfo> quizzes;
    private List<MaterialInfo> materials;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentInfo {
        private UUID id;
        private String name;
        private String avatar;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScheduleInfo {
        private String day;
        private String time;
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

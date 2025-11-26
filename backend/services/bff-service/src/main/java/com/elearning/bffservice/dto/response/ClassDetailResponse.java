package com.elearning.bffservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Comprehensive class detail response for BFF
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassDetailResponse {
    
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
    private StatsInfo stats;
    private List<SessionDetailInfo> sessions;
    private List<AnnouncementInfo> announcements;
    private List<AssignmentInfo> assignments;
    
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
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatsInfo {
        private Integer totalStudents;
        private Integer activeStudents;
        private Integer completedSessions;
        private Integer totalSessions;
        private Double averageAttendance;
        private Double averageProgress;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SessionDetailInfo {
        private UUID id;
        private LocalDate date;
        private String time;
        private String duration;
        private String topic;
        private List<AttendanceInfo> attendance;
        private List<MaterialInfo> materials;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AttendanceInfo {
        private UUID studentId;
        private String status;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnnouncementInfo {
        private UUID id;
        private String title;
        private String content;
        private LocalDate date;
        private String author;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssignmentInfo {
        private UUID id;
        private String title;
        private String description;
        private LocalDate dueDate;
        private Integer submissions;
    }
}

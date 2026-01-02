package com.elearning.classservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Comprehensive class detail response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassDetailResponse {
    
    private UUID id;
    private String title;
    private String description;
    private UUID subjectId;
    private String type; // ONE_ON_ONE, GROUP
    private String status; // CREATED, DRAFT, OPENING, PUBLISHED, IN_PROGRESS, COMPLETED, CANCELLED
    private Integer maxStudents;
    private Double pricePerHour;
    private LocalDateTime createdAt;
    
    // Tutor info
    private TutorInfo tutor;
    
    // Students
    private List<StudentInfo> students;
    
    // Schedules
    private List<ScheduleInfo> schedules;
    
    // Sessions
    private List<SessionInfo> sessions;
    private Integer completedSessions;
    private Integer totalSessions;
    
    // Materials
    private List<MaterialInfo> materials;
    
    // Announcements
    private List<AnnouncementInfo> announcements;
    
    // Assignments
    private List<AssignmentInfo> assignments;
    
    // Stats
    private StatsInfo stats;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TutorInfo {
        private UUID id;
        private String fullName;
        private String avatarUrl;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentInfo {
        private UUID id;
        private String fullName;
        private String avatarUrl;
        private String enrollmentStatus;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScheduleInfo {
        private Integer dayOfWeek; // 1=Monday, 7=Sunday
        private String time; // HH:mm
        private Integer durationMinutes;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SessionInfo {
        private UUID id;
        private Integer sessionNumber;
        private String title;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private String meetingLink;
        private String status;
        private Integer participantsCount;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MaterialInfo {
        private UUID id;
        private String name;
        private String type;
        private String s3Url;
        private LocalDate uploadDate;
        private Long fileSize;
        private String description;
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
        private Double completionRate;
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
        private Integer submissionsCount;
    }
}

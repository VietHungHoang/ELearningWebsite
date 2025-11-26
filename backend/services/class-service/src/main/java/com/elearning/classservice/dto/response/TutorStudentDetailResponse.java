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
 * Detailed response for a specific student of a tutor
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorStudentDetailResponse {
    
    // Basic info
    private UUID studentId;
    private LocalDateTime registeredDate;
    private List<String> enrollmentTypes;
    private String status; // "Ongoing" or "Completed"
    
    // Stats
    private StatsInfo stats;
    
    // Class info
    private ClassInfo classInfo;
    
    // Sessions
    private List<UpcomingSessionInfo> upcomingSessions;
    private List<SessionHistoryInfo> sessionHistory;
    
    // Notes
    private String tutorNotes;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatsInfo {
        private Integer sessionsCompleted;
        private Integer totalSessions;
        private Integer sessionsRemaining;
        private Double completionRate; // percentage
        private Double attendanceRate; // percentage
        private LocalDate lastSessionDate;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClassInfo {
        private String name;
        private String instructor; // Always "You" for the tutor
        private String schedule; // "Mon, Wed, Fri - 3:00 PM"
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpcomingSessionInfo {
        private UUID id;
        private LocalDate date;
        private String time;
        private String duration;
        private String topic;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SessionHistoryInfo {
        private UUID id;
        private LocalDate date;
        private String duration;
        private String attendance;
        private String topic;
    }
}

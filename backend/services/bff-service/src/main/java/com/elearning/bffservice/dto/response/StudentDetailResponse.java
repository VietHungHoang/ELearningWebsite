package com.elearning.bffservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Final student detail response for BFF API
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDetailResponse {
    
    private UUID id;
    private String name;
    private String avatarUrl;
    private LocalDateTime registeredDate;
    private String email;
    private List<String> enrollmentTypes;
    private String status;
    
    private StatsInfo stats;
    private ContactInfo contact;
    private ClassInfo classInfo;
    private List<UpcomingSessionInfo> upcomingSessions;
    private List<SessionHistoryInfo> sessionHistory;
    private List<String> strengths;
    private List<String> weaknesses;
    private String tutorNotes;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatsInfo {
        private Integer sessionsCompleted;
        private Integer totalSessions;
        private Integer sessionsRemaining;
        private Double completionRate;
        private Double attendanceRate;
        private LocalDate lastSessionDate;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContactInfo {
        private String phone;
        private LocalDateTime joinedDate;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClassInfo {
        private String name;
        private String instructor;
        private String schedule;
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

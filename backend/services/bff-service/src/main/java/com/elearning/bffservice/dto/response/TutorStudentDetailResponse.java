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
 * DTOs mirroring Class Service responses
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorStudentDetailResponse {
    
    private UUID studentId;
    private LocalDateTime registeredDate;
    private List<String> enrollmentTypes;
    private String status;
    private StatsInfo stats;
    private ClassInfo classInfo;
    private List<UpcomingSessionInfo> upcomingSessions;
    private List<SessionHistoryInfo> sessionHistory;
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

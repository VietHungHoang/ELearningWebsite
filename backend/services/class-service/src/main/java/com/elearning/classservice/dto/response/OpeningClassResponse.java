package com.elearning.classservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OpeningClassResponse {
    private UUID id;
    private String title;
    private String description;
    private UUID subjectId;
    private String classType;
    private Integer maxStudents;
    private Integer enrolledStudents;
    private Double pricePerHour;
    private List<ScheduleInfo> schedules;
    private TutorBasicInfo tutor;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TutorBasicInfo {
        private UUID id;
        private String fullName;
        private String email;
        private String avatarUrl;
    }
}

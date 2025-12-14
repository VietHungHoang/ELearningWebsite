package com.elearning.bffservice.bff.tutor.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

/**
 * BFF response for group class information
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupClassBffResponse {
    private UUID classId;
    private String classTitle;
    private String classDescription;
    private Integer maxStudents;
    private List<GroupClassStudentBffResponse> students;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GroupClassStudentBffResponse {
        private UUID id;
        private String name;
    }
}
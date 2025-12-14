package com.elearning.bffservice.dto.clas.response;

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
public class GroupClassResponse {
    private UUID classId;
    private String classTitle;
    private String classDescription;
    private Integer maxStudents;
    private List<GroupClassStudent> students;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GroupClassStudent {
        private UUID id;
        private String name;
    }
}
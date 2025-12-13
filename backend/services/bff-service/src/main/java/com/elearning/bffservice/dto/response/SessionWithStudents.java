package com.elearning.bffservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionWithStudents {
    private String id;
    private List<StudentInSession> students;
    private String sessionDatetime;
    private String className;
    private String sessionType;
    private String createdAt;
    private String updatedAt;
    private String meetingUrl;
    private String notes;
}
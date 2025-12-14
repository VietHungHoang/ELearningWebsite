package com.elearning.tutorservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorSubjectResponse {
    private UUID id;
    private UUID subjectId;
    private String subjectName;
    private UUID categoryId;
    private String categoryName;
}
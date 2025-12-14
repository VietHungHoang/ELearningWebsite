package com.elearning.contentservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LectureResponse {
    private Long id;
    private String name;
    private String type; // "video", "article", "quiz"
    private Integer duration;
    private Integer orderIndex;
}
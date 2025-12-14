package com.elearning.courseservice.events;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

// DTO - Data Transfer Object
// Chứa dữ liệu cho sự kiện một khóa học được tạo.
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Data
@Builder
public class CourseCreatedEvent implements Serializable {
    @Builder.Default
    private String eventType = "COURSE_CREATED"; // Giúp consumer phân loại event nếu topic chứa nhiều loại
    private Long courseId;
    private String title;
    private Long instructorId;

    // Cần có constructor không tham số để Deserialization
}
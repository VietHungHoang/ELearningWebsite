package com.elearning.classservice.dto.request;

import com.elearning.classservice.dto.response.ScheduleInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateClassRequest {
    private String title;
    private String description;
    private String subjectId;
    private Double pricePerHour;
    private Integer maxStudents;
    private String status; // CREATED, DRAFT, OPENING, PUBLISHED, IN_PROGRESS, COMPLETED, CANCELLED
    private List<ScheduleInfo> schedules;
}

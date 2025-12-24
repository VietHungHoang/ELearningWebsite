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
public class CreateClassRequest {
    private String title;
    private String subjectId;
    private Double tuitionFee;
    private Integer maxStudents;
    private String description;
    private List<ScheduleInfo> schedules;
}
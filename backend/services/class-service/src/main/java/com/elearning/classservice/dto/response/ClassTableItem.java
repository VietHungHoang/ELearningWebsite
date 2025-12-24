package com.elearning.classservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassTableItem {
    private String id;
    private String title;
    private List<UserInfoResponse> students;
    private String type;
    private String status;
    private List<ScheduleInfo> schedules;
    private String startDate;
    private Integer completedSessions;
    private Integer totalSessions;
}
package com.elearning.classservice.dto.request;

import lombok.Data;

@Data
public class RescheduleRequestRequest {
    private String oldSchedule; // UTC ISO string
    private String newSchedule; // UTC ISO string
    private String reason;
}

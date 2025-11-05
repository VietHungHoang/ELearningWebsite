package com.elearning.commonservice.dto.request;

import lombok.Data;

@Data
public class TimezoneRequest {
    private String name;
    private String utcOffset;
}
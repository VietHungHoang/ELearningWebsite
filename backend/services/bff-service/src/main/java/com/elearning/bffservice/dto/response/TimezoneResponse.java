package com.elearning.bffservice.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class TimezoneResponse {
    private UUID id;
    private String name;
    private String offset;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
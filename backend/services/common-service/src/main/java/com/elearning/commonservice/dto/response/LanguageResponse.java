package com.elearning.commonservice.dto.response;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LanguageResponse {
    private String name;
    private String code;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
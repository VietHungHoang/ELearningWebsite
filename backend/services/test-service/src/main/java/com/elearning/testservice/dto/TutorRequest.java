package com.elearning.testservice.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class TutorRequest {
    private String name;
    private String avatarUrl;
    private Boolean isVerified;
    private String bio;
    private String specialization;
    private String nationalityCode;
    private String videoUrl;
    private String videoThumbnailUrl;
    private BigDecimal currentSessionFee;
    private BigDecimal previousSessionFee;
    private Integer sessionDurationMinutes;
    private String currency;
    private Boolean teachesInGroups;
    private Integer maxGroupMembers;
}
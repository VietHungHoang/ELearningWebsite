package com.elearning.tutorservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorSearchResponse {
    private UUID id;
    private String name;
    private String avatarUrl;
    private String bio;
    private String specialization;
    private String nationalityCode;
    private BigDecimal currentSessionFee;
    private String currency;
    private Double averageRating;
    private Integer reviewCount;
    private List<String> languages;
    private Boolean teachesInGroups;
    private Integer maxGroupMembers;
    private Boolean isVerified;
    private String videoUrl;
    private String videoThumbnailUrl;
    private BigDecimal previousSessionFee;
    private Integer sessionDurationMinutes;
}
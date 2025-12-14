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
public class TutorProfileResponse {
    private UUID id;
    private Boolean isVerified;
    private String introduction;
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
    private String timezoneOffset;

    private List<TutorLanguageResponse> languages;
    private List<TutorSocialResponse> socialLinks;
    private List<TutorSubjectResponse> subjects;
    private List<CareerEntryResponse> careerEntries;
    private List<CertificationResponse> certifications;
}
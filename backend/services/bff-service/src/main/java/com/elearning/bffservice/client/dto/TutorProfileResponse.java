package com.elearning.bffservice.client.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
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

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TutorLanguageResponse {
        private UUID id;
        private String languageCode;
        private String proficiencyLevel;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TutorSocialResponse {
        private UUID id;
        private String platform;
        private String url;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TutorSubjectResponse {
        private UUID id;
        private UUID subjectId;
        private String subjectName;
        private UUID categoryId;
        private String categoryName;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CareerEntryResponse {
        private UUID id;
        private String type;
        private String title;
        private String institution;
        private LocalDate startDate;
        private LocalDate endDate;
        private String location;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CertificationResponse {
        private UUID id;
        private String name;
        private String issuingOrganization;
        private LocalDate issueDate;
        private LocalDate expirationDate;
        private String credentialId;
        private String credentialUrl;
    }
}
package com.elearning.bffservice.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorProfileUpdatedEvent {

    private UUID tutorId;
    private String fullName;
    private String phone;
    private String gender;
    private String countryId;
    private String city;
    private String nativeLanguageCode;
    private List<String> languageCodes;
    private String headline;
    private List<SubjectInfo> subjects;
    private String introduction;
    private List<SocialLinkInfo> socialLinks;
    private List<CareerEntryInfo> careerEntries;
    private List<CertificationInfo> certifications;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubjectInfo {
        private String subjectId;
        private String categoryId;
        private String subjectName;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SocialLinkInfo {
        private String platform;
        private String url;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CareerEntryInfo {
        private String type;
        private String title;
        private String institution;
        private String startDate;
        private String endDate;
        private String location;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CertificationInfo {
        private String name;
        private String issuingOrganization;
        private String issueDate;
        private String expirationDate;
        private String credentialId;
        private String credentialUrl;
    }
}
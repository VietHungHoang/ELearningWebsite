package com.elearning.bffservice.dto.request;

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
public class UpdateTutorProfileRequest {

    private UUID tutorId;
    private String fullName;
    private String phone;
    private String gender;
    private String country;
    private String city;
    private Language nativeLanguage;
    private List<Language> languages;
    private String headline;
    private List<Subject> subjects;
    private String introduction;
    private List<SocialLink> socialLinks;
    private List<CareerEntry> education;
    private List<CareerEntry> experience;
    private List<Certification> certifications;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Language {
        private String id;
        private String name;
        private String code;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Subject {
        private String id;
        private String name;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SocialLink {
        private String id;
        private String platform;
        private String url;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CareerEntry {
        private String id;
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
    public static class Certification {
        private String id;
        private String name;
        private String issuingOrganization;
        private String issueDate;
        private String expirationDate;
        private String credentialId;
        private String credentialUrl;
    }
}
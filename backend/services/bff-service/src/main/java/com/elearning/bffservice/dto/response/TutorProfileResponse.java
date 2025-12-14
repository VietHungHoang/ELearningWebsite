package com.elearning.bffservice.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class TutorProfileResponse {
    private String fullName;
    private String email;
    private String phone;
    private String gender;
    private String city;
    private String headline;
    private List<Subject> subjects;
    private String introduction;
    private String avatarUrl;
    private String introductionVideoUrl;
    private List<SocialLink> socialLinks;
    private List<CareerEntry> education;
    private List<CareerEntry> experience;
    private List<Certification> certifications;

    @Data
    @Builder
    public static class Subject {
        private String id;
        private String name;
    }

    @Data
    @Builder
    public static class SocialLink {
        private String id;
        private String platform;
        private String url;
    }

    @Data
    @Builder
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
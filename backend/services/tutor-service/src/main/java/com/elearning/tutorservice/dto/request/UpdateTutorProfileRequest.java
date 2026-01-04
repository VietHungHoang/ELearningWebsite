package com.elearning.tutorservice.dto.request;

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
public class UpdateTutorProfileRequest {
    
    private String fullName;
    private String gender;
    private String headline;
    private String introduction;
    private String countryCode;
    private String timezone;
    private String videoUrl;
    private BigDecimal currentSessionFee;
    
    // Nested DTOs for related entities
    private List<LanguageInput> languages;
    private List<SocialLinkInput> socialLinks;
    private List<UUID> subjectIds;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LanguageInput {
        private String code;
        private Boolean isNative;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SocialLinkInput {
        private String platform;
        private String url;
    }
}

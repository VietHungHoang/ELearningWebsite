package com.elearning.tutorservice.dto.onboarding;

import com.elearning.tutorservice.dto.response.*;
import com.elearning.tutorservice.entity.CareerEntry;
import com.elearning.tutorservice.entity.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TutorOnboardingDto {
    private UUID id;
    private String email;
    private String fullName;
    private String avatarUrl;
    private String headline;
    private String introduction;
    private String countryCode;
    private Gender gender;
    private String timezone;
    private String videoUrl;
    private BigDecimal currentSessionFee;
    private List<TutorLanguageResponse> languageCodes;
    private List<UUID> subjectIds;
    private List<AvailabilityResponse> availabilities;
    private List<TutorSocialResponse> socialLinks;
    private List<CareerEntryResponse> educations;
    private List<CareerEntryResponse> experiences;
    private List<CertificationResponse> certifications;


}

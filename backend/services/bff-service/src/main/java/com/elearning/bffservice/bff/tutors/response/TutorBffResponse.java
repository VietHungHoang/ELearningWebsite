package com.elearning.bffservice.bff.tutors.response;

import com.elearning.bffservice.dto.tutor.response.TutorLanguageResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import com.elearning.bffservice.dto.tutor.enums.Gender;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class TutorBffResponse {
    private UUID id;
    private String fullName;
    private String email;
    private Boolean isVerified;
    private String introduction;
    private String headline;
    private String countryCode;
    private Gender gender;
    private String avatarUrl;
    private String timezone;
    private String videoUrl;
    private BigDecimal currentSessionFee;
    private BigDecimal originalSessionFee;
    private Double averageRating;
    private Integer reviewCount;
    private List<TutorLanguageResponse> languageCodes;
    private List<UUID> subjectIds;

    // Additional fields from class service stats
    private Integer bookedSessionsCount;
    private Integer studentCount;
    private boolean hasTrialSession;
}
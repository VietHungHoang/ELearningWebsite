package com.elearning.bffservice.dto.tutor.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import com.elearning.bffservice.dto.tutor.enums.Gender;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorResponse {
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
}
package com.elearning.tutorservice.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import com.elearning.tutorservice.dto.response.CareerEntryResponse;
import com.elearning.tutorservice.dto.response.CertificationResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;


@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class TutorResponse extends UserInfoResponse {
    private Boolean isVerified;
    private String headline;
    private String introduction;
    private String videoUrl;
    private BigDecimal currentSessionFee;
    private BigDecimal originalSessionFee;
    private Double averageRating;
    private Integer reviewCount;
    private Integer bookedSessionsCount;
    private Integer studentCount;
    private String countryCode;
    private List<TutorLanguageResponse> languageCodes;
    private List<UUID> subjectIds;
    private List<TutorSocialResponse> socialLinks;
    private List<CareerEntryResponse> educations;
    private List<CareerEntryResponse> experiences;
    private List<CertificationResponse> certificates;
}
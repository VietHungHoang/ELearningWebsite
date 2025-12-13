package com.elearning.bffservice.dto.tutor.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class TutorDetailResponse extends TutorResponse {

    private List<TutorReviewResponse> reviews;
    private List<AvailabilityResponse> availabilities;
    private List<TutorSocialResponse> socialLinks;
    private List<CareerEntryResponse> educations;
    private List<CareerEntryResponse> experiences;
    private List<CertificationResponse> certifications;
}
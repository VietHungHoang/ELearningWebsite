package com.elearning.tutorservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

/**
 * Detailed tutor response that extends the basic TutorResponse and includes
 * reviews, availabilities, social links, educations, experiences and certifications.
 */
@Data
@SuperBuilder
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
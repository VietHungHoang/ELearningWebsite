package com.elearning.bffservice.bff.tutors.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

import com.elearning.bffservice.dto.classes.response.GroupClassResponse;
import com.elearning.bffservice.dto.tutor.response.AvailabilityResponse;
import com.elearning.bffservice.dto.tutor.response.CareerEntryResponse;
import com.elearning.bffservice.dto.tutor.response.CertificationResponse;
import com.elearning.bffservice.dto.tutor.response.TutorReviewResponse;
import com.elearning.bffservice.dto.tutor.response.TutorSocialResponse;

/**
 * BFF response for detailed tutor information including group classes
 */
@Data
@EqualsAndHashCode(callSuper = false)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class TutorDetailBffResponse extends TutorBffResponse {

    private List<TutorReviewResponse> reviews;
    private List<AvailabilityResponse> availabilities;
    private List<TutorSocialResponse> socialLinks;
    private List<CareerEntryResponse> educations;
    private List<CareerEntryResponse> experiences;
    private List<CertificationResponse> certifications;
    private List<GroupClassResponse> groupClasses;
}
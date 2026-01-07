package com.elearning.classservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response for review eligibility check
 * Returns whether a student can review a tutor based on having sessions
 * together
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewEligibilityResponse {

    /**
     * True if student has at least one session with the tutor
     */
    private boolean eligible;

    /**
     * Number of sessions the student has had with this tutor
     */
    private long sessionCount;
}

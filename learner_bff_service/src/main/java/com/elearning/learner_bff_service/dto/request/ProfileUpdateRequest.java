package com.elearning.learner_bff_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileUpdateRequest {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String avatar;
    private String bio;
    private String country;
    private String city;
}

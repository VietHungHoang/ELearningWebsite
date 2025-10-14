package com.elearning.learner_service.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileUpdateRequest {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String skill;
    private String biography;
}

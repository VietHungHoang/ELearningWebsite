package com.elearning.learner_service.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponse {
    private String registrationDate;
    private String firstName;
    private String lastName;
    private String role;
    private String email;
    private String phoneNumber;
    private String skill;
    private String biography;
}

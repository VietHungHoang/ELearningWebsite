package com.elearning.studentservice.dto.response;

import lombok.EqualsAndHashCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class StudentResponse extends UserInfoResponse {
    private String bio;
    private LocalDateTime dateOfBirth;
    private String address;
    private String city;
    private String country;
    private String learningGoals;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

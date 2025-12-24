package com.elearning.studentservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
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

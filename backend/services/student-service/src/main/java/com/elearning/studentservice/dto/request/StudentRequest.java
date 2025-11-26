package com.elearning.studentservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentRequest {
    private String email;
    private String fullname;
    private String phone;
    private String avatar;
    private String bio;
    private LocalDateTime dateOfBirth;
    private String address;
    private String city;
    private String country;
    private String learningGoals;
}

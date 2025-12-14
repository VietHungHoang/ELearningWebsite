package com.elearning.studentservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponse {
    private UUID id;
    private String email;
    private String fullName;
    private String phone;
    private String avatar;
    private String bio;
    private LocalDateTime dateOfBirth;
    private String address;
    private String city;
    private String country;
    private String learningGoals;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

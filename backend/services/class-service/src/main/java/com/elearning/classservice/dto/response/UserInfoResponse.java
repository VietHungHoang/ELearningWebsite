package com.elearning.classservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoResponse {
    private String id;
    private String fullName;
    private String avatarUrl;
    private String enrollmentStatus; // Enrollment status for students in a class
    private LocalDateTime enrolledAt; // When student enrolled (only for students)
}

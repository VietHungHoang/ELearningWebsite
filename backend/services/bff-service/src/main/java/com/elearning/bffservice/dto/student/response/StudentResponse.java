package com.elearning.bffservice.dto.student.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Final student response for BFF API
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponse {
    
    private UUID id;
    private String fullName;
    private String avatarUrl;
    private LocalDateTime registeredDate;
    private String email;
    private List<String> enrollmentTypes;
    private String status; // "Ongoing" or "Completed"
}

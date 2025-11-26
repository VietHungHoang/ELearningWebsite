package com.elearning.bffservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

/**
 * Student profile response from Student Service
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileResponse {
    
    private UUID id;
    private String email;
    private String fullname;
    private String phone;
    private String avatar;
    private String bio;
    private String address;
    private String city;
    private String country;
    private String learningGoals;
    private List<String> strengths;
    private List<String> weaknesses;
}

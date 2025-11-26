package com.elearning.bffservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * User info response from User Service
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoResponse {
    
    private UUID id;
    private String name;
    private String email;
    private String phone;
    private String gender;
    private UUID countryId;
    private String city;
    private String avatarUrl;
}

package com.elearning.userservice.dto.response;

import com.elearning.userservice.entity.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * DTO for returning user information
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
    private Gender gender;
    private UUID countryId;
    private String city;
    private String avatarUrl;
}

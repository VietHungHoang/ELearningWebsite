package com.elearning.tutorservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoResponse {
    private UUID id;
    private String email;
    private String fullName;
    private String avatarUrl;
}

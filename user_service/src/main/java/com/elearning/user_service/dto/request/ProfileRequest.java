package com.elearning.user_service.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileRequest {
    private String fullName;
    private String phone;
    private String avatarUrl;
    private String bio;
}
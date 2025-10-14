package com.elearning.user_service.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponse {
    private Long id;
    private Long accountId; // ✅ cần
    private String fullName;
    private String phone;
    private String avatarUrl;
    private String bio;
}

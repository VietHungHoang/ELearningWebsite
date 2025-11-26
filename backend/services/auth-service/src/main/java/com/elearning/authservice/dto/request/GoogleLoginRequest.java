package com.elearning.authservice.dto.request;

import com.elearning.authservice.entity.Role;
import lombok.Data;

@Data
public class GoogleLoginRequest {
    private String code;  // Authorization code from Google OAuth
    private String redirectUri;  // The redirect URI used in the OAuth flow
    private Role role;  // Role to assign if this is first-time login (STUDENT or TUTOR)
}

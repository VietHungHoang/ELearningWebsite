package com.elearning.authservice.dto.request;

import lombok.Data;

@Data
public class GoogleLoginRequest {
    private String code;  // Authorization code from Google OAuth
    private String redirectUri;  // The redirect URI used in the OAuth flow
}

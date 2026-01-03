package com.elearning.tutorservice.dto.zoom.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response from Zoom OAuth token endpoint
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ZoomOAuthTokenResponse {
    
    @JsonProperty("access_token")
    private String accessToken;
    
    @JsonProperty("token_type")
    private String tokenType;
    
    @JsonProperty("refresh_token")
    private String refreshToken;
    
    @JsonProperty("expires_in")
    private Long expiresIn; // seconds
    
    private String scope;
}

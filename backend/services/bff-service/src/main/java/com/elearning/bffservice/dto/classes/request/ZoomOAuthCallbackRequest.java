package com.elearning.bffservice.dto.classes.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for Zoom OAuth callback
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ZoomOAuthCallbackRequest {

    private String code;
    private String state;
}
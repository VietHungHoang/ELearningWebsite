package com.elearning.classservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for Zoom OAuth callback
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ZoomOAuthCallbackRequest {

    @NotBlank(message = "Authorization code is required")
    private String code;

    @NotBlank(message = "State is required")
    private String state;
}
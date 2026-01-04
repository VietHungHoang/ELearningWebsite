package com.elearning.tutorservice.dto.zoom.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ZoomOAuthCallbackRequest {
    private String code;
    private String state;
}

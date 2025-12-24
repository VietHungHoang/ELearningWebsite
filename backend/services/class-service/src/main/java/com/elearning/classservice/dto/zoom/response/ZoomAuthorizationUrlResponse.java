package com.elearning.classservice.dto.zoom.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ZoomAuthorizationUrlResponse {
    private String authorizationUrl;
}
package com.elearning.bffservice.dto.clas.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ZoomAuthorizationUrlResponse {
    private String authorizationUrl;
}
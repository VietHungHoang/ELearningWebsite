package com.elearning.apigateway.bff.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarkAsReadBFFResponse {

    private String notificationId;
    private String userId;
    private Boolean read;
    private String message;
}
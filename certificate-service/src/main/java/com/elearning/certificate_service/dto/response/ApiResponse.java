package com.elearning.certificate_service.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse<T> {
    private int status;          // HTTP status code
    private String message;      // Success / Error message
    private T data;              // Payload data
}

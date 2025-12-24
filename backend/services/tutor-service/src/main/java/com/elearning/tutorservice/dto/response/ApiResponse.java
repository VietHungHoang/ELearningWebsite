package com.elearning.tutorservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse<T> {
    private int status;      // HTTP status code (200, 400, 500, etc.)
    private Integer error;   // Business error code (e.g., 1001 for profanity violation)
    private boolean success;
    private String message;
    private T data;

    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .status(200)
                .error(null)
                .success(true)
                .message(message)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> error(int status, String message) {
        return ApiResponse.<T>builder()
                .status(status)
                .error(null)
                .success(false)
                .message(message)
                .data(null)
                .build();
    }

    public static <T> ApiResponse<T> businessError(int errorCode, String message) {
        return ApiResponse.<T>builder()
                .status(200)  // HTTP call succeeded
                .error(errorCode)  // Business logic error code
                .success(false)
                .message(message)
                .data(null)
                .build();
    }
}
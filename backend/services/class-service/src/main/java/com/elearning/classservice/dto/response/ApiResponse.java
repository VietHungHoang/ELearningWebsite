package com.elearning.classservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse<T> {
    private int status;
    private boolean success;
    private String message;
    private T data;

    private String errorCode;
    private String errorDescription;

    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .status(200)
                .success(true)
                .message(message)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> error(int status, String message) {
        return ApiResponse.<T>builder()
                .status(status)
                .success(false)
                .message(message)
                .data(null)
                .build();
    }

    public static <T> ApiResponse<T> failure(String errorCode, String errorDescription) {
        return ApiResponse.<T>builder()
                .status(200) // Keep HTTP status 200 as requested
                .success(false)
                .errorCode(errorCode)
                .errorDescription(errorDescription)
                .message(errorDescription)
                .build();
    }
}
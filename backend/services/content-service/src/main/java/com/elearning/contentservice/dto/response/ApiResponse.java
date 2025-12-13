package com.elearning.contentservice.dto.response;

import org.springframework.http.HttpStatus;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ApiResponse<T> {
    
    private int status;
    private T data;
    private String message;

    public ApiResponse(HttpStatus status, T data, String message) {
        this.status = status.value();
        this.data = data;
        this.message = message;
    }
    
    // Success response methods
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(HttpStatus.OK, data, message);
    }
    
    public static <T> ApiResponse<T> success(HttpStatus status, T data, String message) {
        return new ApiResponse<>(status, data, message);
    }
    
    // Error response methods
    public static <T> ApiResponse<T> error(HttpStatus status, String message) {
        return new ApiResponse<>(status, null, message);
    }

    public static <T> ApiResponse<T> error(HttpStatus status, T data, String message) {
        return new ApiResponse<>(status, data, message);
    }
}
package com.elearning.courseservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    
    private int status;
    private T data;
    private String message;
    
    // Success response methods
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(200, data, message);
    }
    
    public static <T> ApiResponse<T> success(int status, T data, String message) {
        return new ApiResponse<>(status, data, message);
    }
    
    // Error response methods
    public static <T> ApiResponse<T> error(int status, String message) {
        return new ApiResponse<>(status, null, message);
    }

    public static <T> ApiResponse<T> error(int status, T data, String message) {
        return new ApiResponse<>(status, data, message);
    }
}

package com.elearning.fileservice.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    
    private int status;
    private T data;
    private String message;
    
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .status(200)
                .data(data)
                .message(message)
                .build();
    }
    
    public static <T> ApiResponse<T> error(int status, String error, String message) {
        return ApiResponse.<T>builder()
                .status(status)
                .message(message)
                .build();
    }
}

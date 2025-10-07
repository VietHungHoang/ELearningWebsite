package com.elearning.notification_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Wrapper chuẩn cho response trả về FE
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse<T> {
    private int status; // HTTP status code
    private String message; // Success / Error message
    private T data; // Payload data

    // ----------------- Static helper methods -----------------

    /**
     * Trả về response thành công mặc định status=200
     */
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .status(200)
                .message("Success")
                .data(data)
                .build();
    }

    /**
     * Trả về response thành công với custom message
     */
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .status(200)
                .message(message)
                .data(data)
                .build();
    }

    /**
     * Trả về response lỗi
     */
    public static <T> ApiResponse<T> error(String message, int status) {
        return ApiResponse.<T>builder()
                .status(status)
                .message(message)
                .data(null)
                .build();
    }

    /**
     * Trả về response lỗi mặc định status=500
     */
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .status(500)
                .message(message)
                .data(null)
                .build();
    }
}

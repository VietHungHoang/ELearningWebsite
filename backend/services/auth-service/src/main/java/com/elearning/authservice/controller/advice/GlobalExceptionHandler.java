package com.elearning.authservice.controller.advice;

import com.elearning.authservice.dto.response.ApiResponse;
import com.elearning.authservice.exception.NotificationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotificationException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotificationException(NotificationException e) {
        return ResponseEntity.status(500).body(ApiResponse.error(e.getMessage(), 500));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception e) {
        return ResponseEntity.status(500).body(ApiResponse.error("Internal server error", 500));
    }
}
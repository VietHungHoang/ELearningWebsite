package com.elearning.authservice.controller.advice;

import com.elearning.authservice.dto.response.ApiResponse;
import com.elearning.authservice.exception.AuthenticationFailedException;
import com.elearning.authservice.exception.NotificationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotificationException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotificationException(NotificationException e) {
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.error(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value()));
    }

    @ExceptionHandler(AuthenticationFailedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthenticationFailedException(AuthenticationFailedException e) {
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.error(e.getMessage() + " - Details: " + e.getErrorDetails(), e.getStatus().value()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception e) {
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.error("Internal server error " + e, HttpStatus.INTERNAL_SERVER_ERROR.value()));
    }
}
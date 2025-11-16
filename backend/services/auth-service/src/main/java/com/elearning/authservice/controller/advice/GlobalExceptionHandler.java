package com.elearning.authservice.controller.advice;

import com.elearning.authservice.dto.response.ApiResponse;
import com.elearning.authservice.exception.AuthenticationFailedException;
import com.elearning.authservice.exception.NotificationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.NoHandlerFoundException;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(NotificationException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotificationException(NotificationException e) {
        logger.error("error: {}", e);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.error(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value()));
    }

    @ExceptionHandler(AuthenticationFailedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthenticationFailedException(AuthenticationFailedException e) {
        logger.error("error: {}", e);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.error(e.getMessage() + " - Details: " + e.getErrorDetails(), e.getStatus().value()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgumentException(IllegalArgumentException e) {
        logger.error("error: {}", e);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.error(e.getMessage(), HttpStatus.BAD_REQUEST.value()));
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNoHandlerFoundException(NoHandlerFoundException e) {
        logger.error("error: 404 Not Found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Endpoint not found", HttpStatus.NOT_FOUND.value()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception e) {
        logger.error("error: {}", e);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.error("Internal server error " + e, HttpStatus.INTERNAL_SERVER_ERROR.value()));
    }
}
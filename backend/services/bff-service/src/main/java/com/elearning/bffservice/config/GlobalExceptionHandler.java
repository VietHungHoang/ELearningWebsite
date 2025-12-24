package com.elearning.bffservice.config;

import com.elearning.bffservice.dto.ApiResponse;
import com.elearning.bffservice.exception.ServiceCallException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global exception handler for the BFF service
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ServiceCallException.class)
    public ResponseEntity<ApiResponse<Void>> handleServiceCallException(ServiceCallException e) {
        log.error("Service call failed: {}", e.getMessage(), e);
        return ResponseEntity.ok(ApiResponse.failure("Service call failed: " + e.getMessage()));
    }

    // Add more exception handlers as needed
}

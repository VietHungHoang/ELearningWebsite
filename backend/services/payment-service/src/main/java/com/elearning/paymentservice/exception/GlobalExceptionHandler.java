package com.elearning.paymentservice.exception;

import com.elearning.paymentservice.dto.response.ApiResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(PaymentProcessingException.class)
    public ResponseEntity<ApiResponse<Void>> handlePaymentProcessingException(PaymentProcessingException e) {
        log.error("Payment processing exception occurred", e);
        return ResponseEntity.status(500).body(
                ApiResponse.<Void>builder()
                        .status(500)
                        .message("Payment processing error: " + e.getMessage())
                        .build()
        );
    }

    @ExceptionHandler(PaymentGatewayException.class)
    public ResponseEntity<ApiResponse<Void>> handlePaymentGatewayException(PaymentGatewayException e) {
        log.error("Payment gateway exception occurred", e);
        return ResponseEntity.status(502).body(
                ApiResponse.<Void>builder()
                        .status(502)
                        .message("Payment gateway error: " + e.getMessage())
                        .build()
        );
    }

    @ExceptionHandler(ConfigurationException.class)
    public ResponseEntity<ApiResponse<Void>> handleConfigurationException(ConfigurationException e) {
        log.error("Configuration exception occurred", e);
        return ResponseEntity.status(500).body(
                ApiResponse.<Void>builder()
                        .status(500)
                        .message("Configuration error: " + e.getMessage())
                        .build()
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgumentException(IllegalArgumentException e) {
        log.error("Illegal argument exception", e);
        return ResponseEntity.status(400).body(
                ApiResponse.<Void>builder()
                        .status(400)
                        .message("Invalid input: " + e.getMessage())
                        .build()
        );
    }

    @ExceptionHandler(JsonProcessingException.class)
    public ResponseEntity<ApiResponse<Void>> handleJsonProcessingException(JsonProcessingException e) {
        log.error("JSON processing exception", e);
        return ResponseEntity.status(500).body(
                ApiResponse.<Void>builder()
                        .status(500)
                        .message("JSON processing error: " + e.getMessage())
                        .build()
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception e) {
        log.error("Unhandled exception", e);
        return ResponseEntity.status(500).body(
                ApiResponse.<Void>builder()
                        .status(500)
                        .message("Internal server error: " + e.getMessage())
                        .build()
        );
    }
}
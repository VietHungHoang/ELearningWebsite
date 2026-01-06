package com.elearning.bffservice.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Health Check Controller
 * Provides health check endpoint for the BFF service
 */
@RestController
@RequestMapping("/api/v1/bff")
@Slf4j
public class HealthController {

    /**
     * Health check endpoint
     *
     * @return Health status of the service
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        log.debug("Health check requested");

        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "bff-service");
        health.put("timestamp", LocalDateTime.now());
        health.put("version", "1.0.0");

        return ResponseEntity.ok(health);
    }
}
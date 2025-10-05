package com.elearning.transcodingservice.controller;

import com.elearning.transcodingservice.service.FFmpegService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/transcoding")
@RequiredArgsConstructor
public class TranscodingHealthController {
    
    private final FFmpegService ffmpegService;
    
    /**
     * Basic health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        
        // Check FFmpeg availability
        boolean ffmpegAvailable = ffmpegService.isFFmpegAvailable();
        
        health.put("status", ffmpegAvailable ? "UP" : "DOWN");
        health.put("service", "transcoding-service");
        health.put("ffmpeg", ffmpegAvailable ? "AVAILABLE" : "NOT_AVAILABLE");
        health.put("timestamp", System.currentTimeMillis());
        
        return ffmpegAvailable ? 
            ResponseEntity.ok(health) : 
            ResponseEntity.status(503).body(health);
    }
    
    /**
     * Detailed status endpoint
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> status() {
        Map<String, Object> status = new HashMap<>();
        
        status.put("service", "transcoding-service");
        status.put("version", "1.0.0");
        status.put("ffmpeg_available", ffmpegService.isFFmpegAvailable());
        status.put("java_version", System.getProperty("java.version"));
        status.put("os_name", System.getProperty("os.name"));
        status.put("available_processors", Runtime.getRuntime().availableProcessors());
        status.put("max_memory", Runtime.getRuntime().maxMemory());
        status.put("free_memory", Runtime.getRuntime().freeMemory());
        status.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(status);
    }
}
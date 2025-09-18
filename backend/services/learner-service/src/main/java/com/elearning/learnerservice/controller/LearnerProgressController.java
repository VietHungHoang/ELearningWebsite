package com.elearning.learnerservice.controller;

import com.elearning.learnerservice.dto.response.ApiResponse;
import com.elearning.learnerservice.model.LearnerProgress;
import com.elearning.learnerservice.service.LearnerProgressService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class LearnerProgressController {

    private final LearnerProgressService learnerProgressService;

    /**
     * Update learning progress
     */
    @PostMapping
    public ResponseEntity<ApiResponse<LearnerProgress>> updateProgress(
            @RequestParam Long learnerId,
            @RequestParam Long courseId,
            @RequestParam Long videoId,
            @RequestParam(required = false) Long lessonId,
            @RequestParam Integer watchTimeSeconds,
            @RequestParam(required = false) Integer videoDurationSeconds) {
        
        log.info("Progress update request for learner {} - video {}", learnerId, videoId);
        
        ApiResponse<LearnerProgress> response = learnerProgressService.updateProgress(
                learnerId, courseId, videoId, lessonId, watchTimeSeconds, videoDurationSeconds);
        
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return new ResponseEntity<>(response, status);
    }

    /**
     * Get learner's progress for a specific course
     */
    @GetMapping("/learner/{learnerId}/course/{courseId}")
    public ResponseEntity<ApiResponse<List<LearnerProgress>>> getCourseProgress(
            @PathVariable Long learnerId,
            @PathVariable Long courseId) {
        
        ApiResponse<List<LearnerProgress>> response = learnerProgressService.getCourseProgress(learnerId, courseId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all progress for a learner
     */
    @GetMapping("/learner/{learnerId}")
    public ResponseEntity<ApiResponse<List<LearnerProgress>>> getLearnerProgress(
            @PathVariable Long learnerId) {
        
        ApiResponse<List<LearnerProgress>> response = learnerProgressService.getLearnerProgress(learnerId);
        return ResponseEntity.ok(response);
    }

    /**
     * Mark content as completed
     */
    @PutMapping("/{progressId}/complete")
    public ResponseEntity<ApiResponse<LearnerProgress>> markAsCompleted(
            @PathVariable Long progressId) {
        
        log.info("Marking progress {} as completed", progressId);
        
        ApiResponse<LearnerProgress> response = learnerProgressService.markAsCompleted(progressId);
        
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.NOT_FOUND;
        return new ResponseEntity<>(response, status);
    }

    /**
     * Toggle bookmark for content
     */
    @PostMapping("/{progressId}/bookmark")
    public ResponseEntity<ApiResponse<LearnerProgress>> toggleBookmark(
            @PathVariable Long progressId) {
        
        ApiResponse<LearnerProgress> response = learnerProgressService.toggleBookmark(progressId);
        
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.NOT_FOUND;
        return new ResponseEntity<>(response, status);
    }

    /**
     * Add or update learner notes
     */
    @PutMapping("/{progressId}/notes")
    public ResponseEntity<ApiResponse<LearnerProgress>> addNotes(
            @PathVariable Long progressId,
            @RequestBody String notes) {
        
        ApiResponse<LearnerProgress> response = learnerProgressService.addNotes(progressId, notes);
        
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.NOT_FOUND;
        return new ResponseEntity<>(response, status);
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        ApiResponse<String> response = ApiResponse.success(
                "Progress service is healthy", "OK");
        return ResponseEntity.ok(response);
    }
}

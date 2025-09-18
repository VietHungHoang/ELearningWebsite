package com.elearning.learnerservice.service;

import com.elearning.learnerservice.dto.response.ApiResponse;
import com.elearning.learnerservice.model.LearnerProgress;
import com.elearning.learnerservice.enums.ProgressStatus;
import com.elearning.learnerservice.repository.LearnerProgressRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class LearnerProgressService {

    private final LearnerProgressRepository learnerProgressRepository;

    /**
     * Update learning progress
     */
    public ApiResponse<LearnerProgress> updateProgress(Long learnerId, Long courseId, Long videoId, 
                                                     Long lessonId, Integer watchTimeSeconds, Integer videoDurationSeconds) {
        
        log.info("Updating progress for learner {} - video {}", learnerId, videoId);

        try {
            return ApiResponse.error(501, "Not implemented yet", "Service under development");
        } catch (Exception e) {
            log.error("Error updating progress: {}", e.getMessage());
            return ApiResponse.error(500, "Failed to update progress", e.getMessage());
        }
    }

    /**
     * Get course progress for learner
     */
    @Transactional(readOnly = true)
    public ApiResponse<List<LearnerProgress>> getCourseProgress(Long learnerId, Long courseId) {
        List<LearnerProgress> progress = learnerProgressRepository
                .findByLearnerIdAndCourseIdOrderByLastWatchedAtDesc(learnerId, courseId);
        
        return ApiResponse.success(progress, "Course progress retrieved successfully");
    }

    /**
     * Get all progress for learner
     */
    @Transactional(readOnly = true)
    public ApiResponse<List<LearnerProgress>> getLearnerProgress(Long learnerId) {
        List<LearnerProgress> progress = learnerProgressRepository
                .findByLearnerIdAndIsCompletedTrueOrderByCompletedAtDesc(learnerId);
        
        return ApiResponse.success(progress, "Learner progress retrieved successfully");
    }

    /**
     * Mark content as completed
     */
    public ApiResponse<LearnerProgress> markAsCompleted(Long progressId) {
        Optional<LearnerProgress> progressOpt = learnerProgressRepository.findById(progressId);
        
        if (progressOpt.isEmpty()) {
            return ApiResponse.error(404, "Progress record not found", "No progress found with given ID");
        }

        LearnerProgress progress = progressOpt.get();
        progress.setIsCompleted(true);
        progress.setCompletedAt(LocalDateTime.now());
        progress.setStatus(ProgressStatus.COMPLETED);

        LearnerProgress savedProgress = learnerProgressRepository.save(progress);
        
        return ApiResponse.success(savedProgress, "Content marked as completed");
    }

    /**
     * Toggle bookmark for content
     */
    public ApiResponse<LearnerProgress> toggleBookmark(Long progressId) {
        Optional<LearnerProgress> progressOpt = learnerProgressRepository.findById(progressId);
        
        if (progressOpt.isEmpty()) {
            return ApiResponse.error(404, "Progress record not found", "No progress found with given ID");
        }

        LearnerProgress progress = progressOpt.get();
        progress.setIsBookmarked(!progress.getIsBookmarked());

        LearnerProgress savedProgress = learnerProgressRepository.save(progress);
        
        return ApiResponse.success(savedProgress, "Bookmark toggled successfully");
    }

    /**
     * Add learner notes to content
     */
    public ApiResponse<LearnerProgress> addNotes(Long progressId, String notes) {
        Optional<LearnerProgress> progressOpt = learnerProgressRepository.findById(progressId);
        
        if (progressOpt.isEmpty()) {
            return ApiResponse.error(404, "Progress record not found", "No progress found with given ID");
        }

        LearnerProgress progress = progressOpt.get();
        progress.setLearnerNotes(notes);

        LearnerProgress savedProgress = learnerProgressRepository.save(progress);
        
        return ApiResponse.success(savedProgress, "Notes saved successfully");
    }
}

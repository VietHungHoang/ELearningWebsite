package com.elearning.searchservice.controller;

import com.elearning.searchservice.dto.ApiResponse;
import com.elearning.searchservice.schedule.CategorySubjectSyncScheduler;
import com.elearning.searchservice.service.BulkReindexService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Admin endpoints for managing Elasticsearch index
 */
@Slf4j
@RestController
@RequestMapping("/v1/admin/search")
@RequiredArgsConstructor
public class AdminSearchController {

    private final BulkReindexService bulkReindexService;
    private final CategorySubjectSyncScheduler categorySubjectSyncScheduler;
    private final com.elearning.searchservice.repository.TutorSearchRepository tutorSearchRepository;

    /**
     * Trigger bulk reindex of all tutors
     * POST /v1/admin/search/reindex-tutors
     */
    @PostMapping("/reindex-tutors")
    public ResponseEntity<ApiResponse<BulkReindexService.ReindexResult>> reindexAllTutors() {
        log.info("Admin triggered bulk reindex of all tutors");

        BulkReindexService.ReindexResult result = bulkReindexService.reindexAllTutors();

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    /**
     * Delete all tutors from index
     * DELETE /v1/admin/search/tutors
     * WARNING: This will delete all data!
     */
    @DeleteMapping("/tutors")
    public ResponseEntity<ApiResponse<Void>> deleteAllTutors() {
        log.warn("Admin triggered deletion of all tutors from index");

        bulkReindexService.deleteAllTutors();

        return ResponseEntity.ok(ApiResponse.success(null));
    }

    /**
     * Trigger manual sync of category and subject data
     * POST /v1/admin/search/sync-categories-subjects
     */
    @PostMapping("/sync-categories-subjects")
    public ResponseEntity<ApiResponse<String>> syncCategoriesAndSubjects() {
        log.info("Admin triggered manual sync of categories and subjects");

        categorySubjectSyncScheduler.triggerManualSync();

        return ResponseEntity.ok(ApiResponse.success("Sync completed successfully"));
    }

    /**
     * Debug endpoint to inspect tutor documents in ES
     * GET /v1/admin/search/debug/tutors
     */
    @org.springframework.web.bind.annotation.GetMapping("/debug/tutors")
    public ResponseEntity<ApiResponse<java.util.List<java.util.Map<String, Object>>>> debugTutors() {
        log.info("Debug: Fetching all tutor documents from ES");

        java.util.List<java.util.Map<String, Object>> tutorDebugInfo = new java.util.ArrayList<>();

        tutorSearchRepository.findAll().forEach(tutor -> {
            java.util.Map<String, Object> info = new java.util.LinkedHashMap<>();
            info.put("id", tutor.getId());
            info.put("fullNameVi", tutor.getFullNameVi());
            info.put("isActive", tutor.getIsActive());
            info.put("categoryIds", tutor.getCategoryIds());
            info.put("subjectIds", tutor.getSubjectIds());
            info.put("categories", tutor.getCategories());
            info.put("subjects", tutor.getSubjects());
            info.put("currentSessionFee", tutor.getCurrentSessionFee());
            info.put("availableDays", tutor.getAvailableDays());
            tutorDebugInfo.add(info);
        });

        log.info("Debug: Found {} tutors in ES", tutorDebugInfo.size());

        return ResponseEntity.ok(ApiResponse.success(tutorDebugInfo));
    }

    /**
     * Debug endpoint to get raw ES document by ID
     * GET /v1/admin/search/tutors/{id}
     */
    @org.springframework.web.bind.annotation.GetMapping("/tutors/{id}")
    public ResponseEntity<ApiResponse<com.elearning.searchservice.entity.TutorDocument>> getTutorById(
            @org.springframework.web.bind.annotation.PathVariable java.util.UUID id) {
        log.info("Debug: Fetching tutor document from ES with ID: {}", id);

        return tutorSearchRepository.findById(id)
                .map(tutor -> ResponseEntity.ok(ApiResponse.success(tutor)))
                .orElse(ResponseEntity.ok(ApiResponse.error("Tutor not found in ES")));
    }
}

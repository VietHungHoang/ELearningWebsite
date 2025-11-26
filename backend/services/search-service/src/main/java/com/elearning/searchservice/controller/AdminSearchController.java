package com.elearning.searchservice.controller;

import com.elearning.searchservice.dto.ApiResponse;
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
}

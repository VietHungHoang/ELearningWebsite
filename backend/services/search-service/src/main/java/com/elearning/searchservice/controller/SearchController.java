package com.elearning.searchservice.controller;

import com.elearning.searchservice.dto.ApiResponse;
import com.elearning.searchservice.dto.request.SearchTutorRequest;
import com.elearning.searchservice.dto.response.SearchFacets;
import com.elearning.searchservice.dto.response.TutorSearchResult;
import com.elearning.searchservice.service.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Search controller with multi-language support
 */
@Slf4j
@RestController
@RequestMapping("/v1/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    /**
     * Enhanced search endpoint with multi-language support
     * POST /v1/search/tutors
     */
    @PostMapping("/tutors")
    public ResponseEntity<ApiResponse<Page<TutorSearchResult>>> searchTutors(
            @RequestBody SearchTutorRequest request) {
        
        log.info("Search request: keyword={}, language={}, filters={}", 
                request.getKeyword(), request.getLanguage(), request);
        
        Page<TutorSearchResult> results = searchService.searchTutors(request);
        
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    /**
     * Get search facets/aggregations
     * POST /v1/search/tutors/facets
     */
    @PostMapping("/tutors/facets")
    public ResponseEntity<ApiResponse<SearchFacets>> getSearchFacets(
            @RequestBody SearchTutorRequest request) {
        
        SearchFacets facets = searchService.getSearchFacets(request);
        
        return ResponseEntity.ok(ApiResponse.success(facets));
    }

    /**
     * Simple GET endpoint for basic search (backward compatibility)
     * GET /v1/search/tutors?keyword=...&language=...
     */
    @GetMapping("/tutors")
    public ResponseEntity<ApiResponse<Page<TutorSearchResult>>> searchTutorsSimple(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String language,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        SearchTutorRequest request = SearchTutorRequest.builder()
                .keyword(keyword)
                .language(language)
                .page(page)
                .size(size)
                .build();
        
        Page<TutorSearchResult> results = searchService.searchTutors(request);
        
        return ResponseEntity.ok(ApiResponse.success(results));
    }
}
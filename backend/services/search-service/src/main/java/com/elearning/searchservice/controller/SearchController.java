package com.elearning.searchservice.controller;

import com.elearning.searchservice.dto.ApiResponse;
import com.elearning.searchservice.dto.request.SearchTutorRequest;
import com.elearning.searchservice.dto.request.TutorSuggestionsRequest;
import com.elearning.searchservice.dto.response.SearchFacets;
import com.elearning.searchservice.dto.response.TutorSearchResult;
import com.elearning.searchservice.dto.response.TutorSuggestion;
import com.elearning.searchservice.service.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

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
     * Get tutor search suggestions using fuzzy search
     * GET /v1/search/tutors/suggestions?keyword=...&language=...&limit=...
     */
    @GetMapping("/tutors/suggestions")
    public ResponseEntity<ApiResponse<List<TutorSuggestion>>> getTutorSuggestions(
            @RequestParam String keyword,
            @RequestParam(required = false) String language,
            @RequestParam(defaultValue = "10") Integer limit) {

        TutorSuggestionsRequest request = TutorSuggestionsRequest.builder()
                .keyword(keyword)
                .language(language)
                .limit(limit)
                .build();

        log.info("Tutor suggestions request: keyword={}, language={}, limit={}",
                request.getKeyword(), request.getLanguage(), request.getLimit());

        List<TutorSuggestion> suggestions = searchService.getTutorSuggestions(request);

        return ResponseEntity.ok(ApiResponse.success(suggestions));
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
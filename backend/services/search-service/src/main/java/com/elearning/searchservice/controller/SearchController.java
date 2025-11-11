package com.elearning.searchservice.controller;

import com.elearning.searchservice.dto.ApiResponse;
import com.elearning.searchservice.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/tutors")
    public ResponseEntity<ApiResponse<Page<UUID>>> searchTutors(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean teachesInGroups,
            @RequestParam(required = false) List<String> languageCodes,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String categoryName,
            @RequestParam(required = false) List<String> availableDays,
            Pageable pageable) {

        Page<UUID> result = searchService.searchTutors(keyword, teachesInGroups, categoryName, minPrice, maxPrice,
                languageCodes, pageable);

        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
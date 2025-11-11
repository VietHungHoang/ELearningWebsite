package com.elearning.bffservice.controller;

import com.elearning.bffservice.dto.response.ApiResponse;
import com.elearning.bffservice.dto.response.TutorSearchResponse;
import com.elearning.bffservice.service.TutorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/tutors")
@RequiredArgsConstructor
public class TutorController {

    private final TutorService tutorService;

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<TutorSearchResponse>>> searchTutors(
            @RequestParam(required = false) List<String> languageCodes,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) Boolean categoryIsParent,
            @RequestParam(required = false) List<String> availableDays,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<TutorSearchResponse> result = tutorService.searchTutors(languageCodes, minPrice, maxPrice, categoryId, Boolean.TRUE.equals(categoryIsParent), availableDays, page, size);
        ApiResponse<Page<TutorSearchResponse>> response = ApiResponse.success(result, "Tutors searched successfully");
        return ResponseEntity.ok(response);
    }
}
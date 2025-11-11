package com.elearning.tutorservice.controller;

import com.elearning.tutorservice.dto.response.TutorSearchResponse;
import com.elearning.tutorservice.service.TutorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
@RequestMapping("/tutors")
@RequiredArgsConstructor
public class TutorController {

    private final TutorService tutorService;

    @GetMapping("/search")
    public ResponseEntity<Page<TutorSearchResponse>> searchTutors(
            @RequestParam(required = false) List<String> languageCodes,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) List<UUID> categoryIds,
            @RequestParam(required = false) List<String> availableDays,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<TutorSearchResponse> results = tutorService.searchTutors(languageCodes, minPrice, maxPrice, categoryIds, availableDays, pageable);

        return ResponseEntity.ok(results);
    }
}
package com.elearning.commonservice.controller;

import com.elearning.commonservice.dto.response.ApiResponse;
import com.elearning.commonservice.dto.response.LanguageResponse;
import com.elearning.commonservice.service.LanguageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/common/languages")
@RequiredArgsConstructor
public class LanguageController {

    private final LanguageService languageService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<LanguageResponse>>> getAll() {
        List<LanguageResponse> languages = languageService.getAll();
        return ResponseEntity.ok(ApiResponse.success(languages, "Languages retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LanguageResponse>> getById(@PathVariable UUID id) {
        LanguageResponse language = languageService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(language, "Language retrieved successfully"));
    }
}
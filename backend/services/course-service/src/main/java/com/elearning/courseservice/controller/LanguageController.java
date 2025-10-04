package com.elearning.courseservice.controller;

import com.elearning.courseservice.dto.response.ApiResponse;
import com.elearning.courseservice.dto.response.LanguageResponse;
import com.elearning.courseservice.service.LanguageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/languages")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class LanguageController {
    
    private final LanguageService languageService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<LanguageResponse>>> getAllLanguages() {
        List<LanguageResponse> languages = languageService.getAllLanguages();
        ApiResponse<List<LanguageResponse>> response = ApiResponse.success(languages, "Languages retrieved successfully");
        return ResponseEntity.ok(response);
    }
}
package com.elearning.bffservice.controller;

import com.elearning.bffservice.dto.response.ApiResponse;
import com.elearning.bffservice.dto.response.CountryResponse;
import com.elearning.bffservice.dto.response.LanguageResponse;
import com.elearning.bffservice.dto.response.SubjectResponse;
import com.elearning.bffservice.dto.response.TutorFilterResponse;
import com.elearning.bffservice.service.CommonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/bff/common")
@RequiredArgsConstructor
public class CommonController {

    private final CommonService commonService;

    @GetMapping("/tutor-filter")
    public ResponseEntity<ApiResponse<TutorFilterResponse>> getTutorFilter() {
        TutorFilterResponse response = commonService.getTutorFilter();
        ApiResponse<TutorFilterResponse> apiResponse = ApiResponse.success(response, "Tutor filter data retrieved successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/countries")
    public ResponseEntity<ApiResponse<List<CountryResponse>>> getAllCountries() {
        List<CountryResponse> response = commonService.getAllCountries();
        ApiResponse<List<CountryResponse>> apiResponse = ApiResponse.success(response, "Countries retrieved successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/languages")
    public ResponseEntity<ApiResponse<List<LanguageResponse>>> getAllLanguages() {
        List<LanguageResponse> response = commonService.getAllLanguages();
        ApiResponse<List<LanguageResponse>> apiResponse = ApiResponse.success(response, "Languages retrieved successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/subjects")
    public ResponseEntity<ApiResponse<List<SubjectResponse>>> getAllSubjects() {
        List<SubjectResponse> response = commonService.getAllSubjects();
        ApiResponse<List<SubjectResponse>> apiResponse = ApiResponse.success(response, "Subjects retrieved successfully");
        return ResponseEntity.ok(apiResponse);
    }
}
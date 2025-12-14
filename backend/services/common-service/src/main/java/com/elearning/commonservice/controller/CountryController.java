package com.elearning.commonservice.controller;

import com.elearning.commonservice.dto.response.ApiResponse;
import com.elearning.commonservice.dto.response.CountryResponse;
import com.elearning.commonservice.service.CountryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/common/countries")
@RequiredArgsConstructor
public class CountryController {

    private final CountryService countryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CountryResponse>>> getAll() {
        List<CountryResponse> countries = countryService.getAll();
        return ResponseEntity.ok(ApiResponse.success(countries, "Countries retrieved successfully"));
    }
}
package com.elearning.commonservice.controller;

import com.elearning.commonservice.dto.request.TimezoneRequest;
import com.elearning.commonservice.dto.response.ApiResponse;
import com.elearning.commonservice.dto.response.TimezoneResponse;
import com.elearning.commonservice.service.TimezoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/common/timezones")
@RequiredArgsConstructor
public class TimezoneController {

    private final TimezoneService timezoneService;

    @PostMapping
    public ResponseEntity<ApiResponse<TimezoneResponse>> create(@RequestBody TimezoneRequest request) {
        TimezoneResponse response = timezoneService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response, "Timezone created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TimezoneResponse>>> getAll() {
        List<TimezoneResponse> timezones = timezoneService.getAll();
        return ResponseEntity.ok(ApiResponse.success(timezones, "Timezones retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TimezoneResponse>> getById(@PathVariable UUID id) {
        TimezoneResponse timezone = timezoneService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(timezone, "Timezone retrieved successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TimezoneResponse>> update(@PathVariable UUID id, @RequestBody TimezoneRequest request) {
        TimezoneResponse timezone = timezoneService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success(timezone, "Timezone updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        timezoneService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Timezone deleted successfully"));
    }
}
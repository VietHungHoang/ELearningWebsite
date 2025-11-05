package com.elearning.commonservice.controller;

import com.elearning.commonservice.dto.request.LanguageRequest;
import com.elearning.commonservice.dto.response.LanguageResponse;
import com.elearning.commonservice.service.LanguageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/common/languages")
@RequiredArgsConstructor
public class LanguageController {

    private final LanguageService languageService;

    @PostMapping
    public ResponseEntity<LanguageResponse> create(@RequestBody LanguageRequest request) {
        LanguageResponse response = languageService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<LanguageResponse>> getAll() {
        return ResponseEntity.ok(languageService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LanguageResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(languageService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LanguageResponse> update(@PathVariable UUID id, @RequestBody LanguageRequest request) {
        return ResponseEntity.ok(languageService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        languageService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
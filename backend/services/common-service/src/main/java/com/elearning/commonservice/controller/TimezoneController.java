package com.elearning.commonservice.controller;

import com.elearning.commonservice.dto.request.TimezoneRequest;
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
    public ResponseEntity<TimezoneResponse> create(@RequestBody TimezoneRequest request) {
        TimezoneResponse response = timezoneService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<TimezoneResponse>> getAll() {
        return ResponseEntity.ok(timezoneService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimezoneResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(timezoneService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimezoneResponse> update(@PathVariable UUID id, @RequestBody TimezoneRequest request) {
        return ResponseEntity.ok(timezoneService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        timezoneService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
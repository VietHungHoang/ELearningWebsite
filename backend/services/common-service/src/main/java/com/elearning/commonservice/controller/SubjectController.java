package com.elearning.commonservice.controller;

import com.elearning.commonservice.dto.request.SubjectRequest;
import com.elearning.commonservice.dto.response.ApiResponse;
import com.elearning.commonservice.dto.response.SubjectResponse;
import com.elearning.commonservice.service.SubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/common/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SubjectResponse>>> getAll() {
        List<SubjectResponse> subjects = subjectService.getAll();
        return ResponseEntity.ok(ApiResponse.success(subjects, "Subjects retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SubjectResponse>> create(@Valid @RequestBody SubjectRequest request) {
        SubjectResponse subject = subjectService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(subject, "Subject created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SubjectResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody SubjectRequest request) {
        SubjectResponse subject = subjectService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success(subject, "Subject updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        subjectService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Subject deleted successfully"));
    }
}

package com.elearning.tutorservice.controller;

import com.elearning.tutorservice.dto.response.ApiResponse;
import com.elearning.tutorservice.dto.response.TutorResponse;
import com.elearning.tutorservice.service.TutorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/tutors")
@RequiredArgsConstructor
public class TutorController {

    private final TutorService tutorService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TutorResponse>> getTutorInfo(@PathVariable UUID id) {
        TutorResponse detail = tutorService.getTutorById(id);
        return ResponseEntity.ok(ApiResponse.success(detail, "Tutor detail retrieved successfully"));
    }

    @GetMapping("/batch")
    public ResponseEntity<ApiResponse<List<TutorResponse>>> getTutorsBatch(@RequestParam List<UUID> ids) {
        List<TutorResponse> tutors = tutorService.getTutorsByIds(ids);
        return ResponseEntity.ok(ApiResponse.success(tutors, "Tutors retrieved successfully"));
    }
}
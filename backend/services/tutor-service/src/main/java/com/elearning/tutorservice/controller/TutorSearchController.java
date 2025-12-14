package com.elearning.tutorservice.controller;

import com.elearning.tutorservice.dto.response.ApiResponse;
import com.elearning.tutorservice.dto.response.TutorResponse;
import com.elearning.tutorservice.service.TutorSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/tutors")
@RequiredArgsConstructor
public class TutorSearchController {

    private final TutorSearchService tutorSearchService;

    @GetMapping("/batch")
    public ResponseEntity<ApiResponse<List<TutorResponse>>> getTutorsByIds(@RequestParam List<UUID> ids) {
        List<TutorResponse> tutors = tutorSearchService.getTutorsByIds(ids);
        ApiResponse<List<TutorResponse>> response = ApiResponse.success(tutors, "Tutors retrieved successfully");
        return ResponseEntity.ok(response);
    }
}

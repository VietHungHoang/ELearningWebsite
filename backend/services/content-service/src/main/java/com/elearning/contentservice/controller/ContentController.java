package com.elearning.contentservice.controller;

import com.elearning.contentservice.dto.response.ApiResponse;
import com.elearning.contentservice.dto.response.SectionResponse;
import com.elearning.contentservice.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ContentController {
    
    private final ContentService contentService;
    
    @GetMapping("/courses/{courseId}/sections")
    public ResponseEntity<ApiResponse<List<SectionResponse>>> getSectionsByCourseId(@PathVariable Long courseId) {
        List<SectionResponse> sections = contentService.getSectionsByCourseId(courseId);
        return ResponseEntity.ok(ApiResponse.success(sections, "Sections retrieved successfully"));
    }
    
    @PostMapping("/courses/{courseId}/sections/base")
    public ResponseEntity<ApiResponse<String>> createBaseSectionForNewCourse(@PathVariable Long courseId) {
        contentService.createBaseSectionForNewCourse(courseId);
        return ResponseEntity.ok(ApiResponse.success("Success", "Base section created successfully for course " + courseId));
    }
}
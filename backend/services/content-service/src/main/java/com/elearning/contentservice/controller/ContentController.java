package com.elearning.contentservice.controller;

import com.elearning.contentservice.dto.response.SectionResponse;
import com.elearning.contentservice.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
public class ContentController {
    
    private final ContentService contentService;
    
    @GetMapping("/courses/{courseId}/sections")
    public ResponseEntity<List<SectionResponse>> getSectionsByCourseId(@PathVariable Long courseId) {
        List<SectionResponse> sections = contentService.getSectionsByCourseId(courseId);
        return ResponseEntity.ok(sections);
    }
    
    // @PostMapping("/courses/{courseId}/sections/base")
    // public ResponseEntity<String> createBaseSectionForNewCourse(@PathVariable Long courseId) {
    //     contentService.createBaseSectionForNewCourse(courseId);
    //     return ResponseEntity.ok("Base section created successfully for course " + courseId);
    // }
}
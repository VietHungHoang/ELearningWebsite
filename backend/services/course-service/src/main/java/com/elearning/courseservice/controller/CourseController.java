package com.elearning.courseservice.controller;

import com.elearning.courseservice.dto.response.CourseResponse;
import com.elearning.courseservice.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {
    
    private final CourseService courseService;

    @GetMapping("/tutor/{tutorId}")
    public ResponseEntity<List<CourseResponse>> getCoursesByTutorId(@PathVariable UUID tutorId) {
        List<CourseResponse> courses = courseService.getCoursesByTutorId(tutorId);
        return ResponseEntity.ok(courses);
    }
}

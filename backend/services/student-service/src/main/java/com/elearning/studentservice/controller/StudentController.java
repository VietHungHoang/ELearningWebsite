package com.elearning.studentservice.controller;

import com.elearning.studentservice.dto.response.ApiResponse;
import com.elearning.studentservice.dto.response.StudentResponse;
import com.elearning.studentservice.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
public class StudentController {
    
    private final StudentService studentService;
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudentById(@PathVariable UUID id) {
        StudentResponse response = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Student retrieved successfully"));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<StudentResponse>>> getListStudent(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("asc") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<StudentResponse> students = studentService.getAllStudents(pageable);
        
        return ResponseEntity.ok(ApiResponse.success(students, "Students retrieved successfully"));
    }

    @GetMapping("/batch")
    public ResponseEntity<ApiResponse<List<StudentResponse>>> getStudentsByIds(@RequestParam List<UUID> ids) {
        List<StudentResponse> response = studentService.getStudentsListByIds(ids);
        return ResponseEntity.ok(ApiResponse.success(response, "Students retrieved successfully"));
    }
}

package com.elearning.studentservice.controller;

import com.elearning.studentservice.dto.request.StudentRequest;
import com.elearning.studentservice.dto.response.StudentResponse;
import com.elearning.studentservice.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
public class StudentController {
    
    private final StudentService studentService;
    
    @PostMapping
    public ResponseEntity<StudentResponse> createStudent(@RequestBody StudentRequest request) {
        StudentResponse response = studentService.createStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<StudentResponse> updateStudent(
            @PathVariable UUID id,
            @RequestBody StudentRequest request) {
        StudentResponse response = studentService.updateStudent(id, request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<StudentResponse> getStudentById(@PathVariable UUID id) {
        StudentResponse response = studentService.getStudentById(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get list of students with pagination
     * 
     * @param page Page number (default: 0)
     * @param size Page size (default: 10)
     * @param sortBy Sort field (default: createdAt)
     * @param sortDir Sort direction (asc/desc, default: desc)
     * @return Paginated list of students
     */
    @GetMapping
    public ResponseEntity<Page<StudentResponse>> getListStudent(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("asc") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<StudentResponse> students = studentService.getAllStudents(pageable);
        
        return ResponseEntity.ok(students);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable UUID id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}

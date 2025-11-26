package com.elearning.studentservice.service;

import com.elearning.studentservice.dto.request.StudentRequest;
import com.elearning.studentservice.dto.response.StudentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface StudentService {
    StudentResponse createStudent(StudentRequest request);
    StudentResponse updateStudent(UUID id, StudentRequest request);
    StudentResponse getStudentById(UUID id);
    Page<StudentResponse> getAllStudents(Pageable pageable);
    void deleteStudent(UUID id);
}

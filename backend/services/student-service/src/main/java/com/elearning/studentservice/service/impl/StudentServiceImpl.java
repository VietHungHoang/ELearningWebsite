package com.elearning.studentservice.service.impl;

import com.elearning.studentservice.dto.event.AccountCreatedEvent;
import com.elearning.studentservice.dto.request.StudentRequest;
import com.elearning.studentservice.dto.response.StudentResponse;
import com.elearning.studentservice.entity.Student;
import com.elearning.studentservice.repository.StudentRepository;
import com.elearning.studentservice.mapper.StudentMapper;
import com.elearning.studentservice.service.StudentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentServiceImpl implements StudentService {
    
    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;
    
    @Override
    @Transactional
    public StudentResponse createStudent(AccountCreatedEvent request) {
        log.info("Creating new student with email: {}", request.getEmail());
        
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Student with email " + request.getEmail() + " already exists");
        }
        
        Student student = Student.builder()
                .email(request.getEmail())
                .fullName(request.getFullName())
                .build();

        Student savedStudent = studentRepository.save(student);
        log.info("Student created successfully with id: {}", savedStudent.getId());
        
        return studentMapper.toStudentResponse(savedStudent);
    }
    
    @Override
    @Transactional(readOnly = true)
    public StudentResponse getStudentById(UUID id) {
        log.info("Fetching student with id: {}", id);
        
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with id: " + id));
        
        return studentMapper.toStudentResponse(student);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<StudentResponse> getAllStudents(Pageable pageable) {
        log.info("Fetching all students with pagination: page={}, size={}", 
                pageable.getPageNumber(), pageable.getPageSize());
        
        Page<Student> studentsPage = studentRepository.findAll(pageable);
        
        return studentsPage.map(studentMapper::toStudentResponse);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<StudentResponse> getStudentsListByIds(List<UUID> ids) {
        log.info("Fetching students list by ids: {}", ids);

        List<Student> students = studentRepository.findAllById(ids);

        return students.stream()
                .map(studentMapper::toStudentResponse)
                .collect(java.util.stream.Collectors.toList());
    }
}

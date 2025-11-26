package com.elearning.studentservice.service.impl;

import com.elearning.studentservice.dto.request.StudentRequest;
import com.elearning.studentservice.dto.response.StudentResponse;
import com.elearning.studentservice.entity.Student;
import com.elearning.studentservice.repository.StudentRepository;
import com.elearning.studentservice.service.StudentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentServiceImpl implements StudentService {
    
    private final StudentRepository studentRepository;
    
    @Override
    @Transactional
    public StudentResponse createStudent(StudentRequest request) {
        log.info("Creating new student with email: {}", request.getEmail());
        
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Student with email " + request.getEmail() + " already exists");
        }
        
        Student student = Student.builder()
                .email(request.getEmail())
                .fullname(request.getFullname())
                .phone(request.getPhone())
                .avatar(request.getAvatar())
                .bio(request.getBio())
                .dateOfBirth(request.getDateOfBirth())
                .address(request.getAddress())
                .city(request.getCity())
                .country(request.getCountry())
                .learningGoals(request.getLearningGoals())
                .build();
        
        Student savedStudent = studentRepository.save(student);
        log.info("Student created successfully with id: {}", savedStudent.getId());
        
        return mapToResponse(savedStudent);
    }
    
    @Override
    @Transactional
    public StudentResponse updateStudent(UUID id, StudentRequest request) {
        log.info("Updating student with id: {}", id);
        
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with id: " + id));
        
        student.setFullname(request.getFullname());
        student.setPhone(request.getPhone());
        student.setAvatar(request.getAvatar());
        student.setBio(request.getBio());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setAddress(request.getAddress());
        student.setCity(request.getCity());
        student.setCountry(request.getCountry());
        student.setLearningGoals(request.getLearningGoals());
        
        Student updatedStudent = studentRepository.save(student);
        log.info("Student updated successfully with id: {}", updatedStudent.getId());
        
        return mapToResponse(updatedStudent);
    }
    
    @Override
    @Transactional(readOnly = true)
    public StudentResponse getStudentById(UUID id) {
        log.info("Fetching student with id: {}", id);
        
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with id: " + id));
        
        return mapToResponse(student);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<StudentResponse> getAllStudents(Pageable pageable) {
        log.info("Fetching all students with pagination: page={}, size={}", 
                pageable.getPageNumber(), pageable.getPageSize());
        
        Page<Student> studentsPage = studentRepository.findAll(pageable);
        
        return studentsPage.map(this::mapToResponse);
    }
    
    @Override
    @Transactional
    public void deleteStudent(UUID id) {
        log.info("Deleting student with id: {}", id);
        
        if (!studentRepository.existsById(id)) {
            throw new IllegalArgumentException("Student not found with id: " + id);
        }
        
        studentRepository.deleteById(id);
        log.info("Student deleted successfully with id: {}", id);
    }
    
    private StudentResponse mapToResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .email(student.getEmail())
                .fullname(student.getFullname())
                .phone(student.getPhone())
                .avatar(student.getAvatar())
                .bio(student.getBio())
                .dateOfBirth(student.getDateOfBirth())
                .address(student.getAddress())
                .city(student.getCity())
                .country(student.getCountry())
                .learningGoals(student.getLearningGoals())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .build();
    }
}

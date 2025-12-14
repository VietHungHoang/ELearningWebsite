package com.elearning.studentservice.mapper;

import com.elearning.studentservice.dto.response.StudentResponse;
import com.elearning.studentservice.entity.Student;
import org.springframework.stereotype.Component;

/**
 * Mapper for Student entity to DTO conversions
 */
@Component
public class StudentMapper {

    /**
     * Convert Student entity to StudentResponse DTO
     */
    public StudentResponse toStudentResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .email(student.getEmail())
                .fullName(student.getFullname())
                .phone(student.getPhone())
                .avatar(student.getAvatarUrl())
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
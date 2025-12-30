package com.elearning.studentservice.mapper;

import com.elearning.studentservice.dto.response.StudentResponse;
import com.elearning.studentservice.dto.response.UserInfoResponse;
import com.elearning.studentservice.entity.Student;
import org.springframework.stereotype.Component;

@Component
public class StudentMapper {

    public StudentResponse toStudentResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .email(student.getEmail())
                .fullName(student.getFullName())
                .avatarUrl(student.getAvatarUrl())
                .dateOfBirth(student.getDateOfBirth())
                .country(student.getCountry())
                .learningGoals(student.getLearningGoals())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .build();
    }

    public UserInfoResponse toUserInfoResponse(Student student) {
        return UserInfoResponse.builder()
                .id(student.getId())
                .email(student.getEmail())
                .fullName(student.getFullName())
                .avatarUrl(student.getAvatarUrl())
                .build();
    }
}
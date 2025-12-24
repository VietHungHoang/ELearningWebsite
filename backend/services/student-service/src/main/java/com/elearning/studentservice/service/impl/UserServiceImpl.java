package com.elearning.studentservice.service.impl;

import com.elearning.studentservice.dto.response.UserInfoResponse;
import com.elearning.studentservice.entity.Student;
import com.elearning.studentservice.mapper.StudentMapper;
import com.elearning.studentservice.repository.StudentRepository;
import com.elearning.studentservice.service.StudentService;
import com.elearning.studentservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;

    @Override
    public List<UserInfoResponse> getUsersByIds(List<UUID> userIds) {
        List<Student> students = studentRepository.findAllById(userIds);
        return students.stream()
                .map(studentMapper::toUserInfoResponse)
                .collect(Collectors.toList());
    }
}

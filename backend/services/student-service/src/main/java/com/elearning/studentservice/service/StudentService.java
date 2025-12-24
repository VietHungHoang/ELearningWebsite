package com.elearning.studentservice.service;

import com.elearning.studentservice.dto.event.AccountCreatedEvent;
import com.elearning.studentservice.dto.request.StudentRequest;
import com.elearning.studentservice.dto.response.StudentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface StudentService {
    StudentResponse createStudent(AccountCreatedEvent request);
    StudentResponse getStudentById(UUID id);
    List<StudentResponse> getStudentsListByIds(List<UUID> ids);
    List<StudentResponse> getStudentBasicInfosByIds(List<UUID> ids);
    Page<StudentResponse> getAllStudents(Pageable pageable);
}

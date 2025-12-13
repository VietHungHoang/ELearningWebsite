package com.elearning.courseservice.service;

import com.elearning.courseservice.dto.response.CourseResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface CourseService {
    List<CourseResponse> getCoursesByTutorId(UUID tutorId);
}
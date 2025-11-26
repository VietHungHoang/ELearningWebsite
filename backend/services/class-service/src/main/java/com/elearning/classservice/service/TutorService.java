package com.elearning.classservice.service;

import com.elearning.classservice.dto.response.TutorStudentResponse;
import com.elearning.classservice.dto.response.TutorStudentDetailResponse;
import com.elearning.classservice.dto.response.ClassDetailResponse;
import com.elearning.classservice.dto.response.TutorClassResponse;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface TutorService {
    
    /**
     * Get all students of a tutor with pagination
     * @param tutorId Tutor ID
     * @param page Page number
     * @param size Page size
     * @return Spring Page of TutorStudentResponse
     */
    Page<TutorStudentResponse> getAllStudentsByTutorId(UUID tutorId, int page, int size);
    
    /**
     * Get detailed information about a specific student
     * @param tutorId Tutor ID
     * @param studentId Student ID
     * @return Detailed student information
     */
    TutorStudentDetailResponse getStudentDetail(UUID tutorId, UUID studentId);
    
    /**
     * Get all classes of a tutor with pagination
     * @param tutorId Tutor ID
     * @param page Page number
     * @param size Page size
     * @return Spring Page of TutorClassResponse
     */
    Page<TutorClassResponse> getClasses(UUID tutorId, int page, int size);
    
    /**
     * Get detailed information about a specific class
     * @param tutorId Tutor ID
     * @param classId Class ID
     * @return Detailed class information
     */
    ClassDetailResponse getClassDetail(UUID tutorId, UUID classId);
}

package com.elearning.classservice.service;

import com.elearning.classservice.dto.response.TutorStudentResponse;
import com.elearning.classservice.dto.response.TutorStudentDetailResponse;
import com.elearning.classservice.dto.response.ClassDetailResponse;
import com.elearning.classservice.dto.response.TutorClassResponse;
import com.elearning.classservice.dto.response.TutorStatsResponse;
import com.elearning.classservice.dto.response.GroupClassResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface TutorService {
    
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
    
    /**
     * Get statistics for multiple tutors including booked sessions count and student count
     * @param tutorIds List of tutor IDs
     * @param studentId Optional student ID to filter reviews by
     * @return List of tutor statistics
     */
    List<TutorStatsResponse> getTutorStats(List<UUID> tutorIds, UUID studentId);

    /**
     * Get list of group classes (classes with maxStudents > 1) for a tutor
     * including waiting list of students
     * @param tutorId Tutor ID
     * @return List of group classes with student waiting lists
     */
    List<GroupClassResponse> getGroupClasses(UUID tutorId);
}

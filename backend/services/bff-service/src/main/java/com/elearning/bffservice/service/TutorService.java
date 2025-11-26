package com.elearning.bffservice.service;

import com.elearning.bffservice.dto.request.BulkUpdateAvailabilityRequest;
import com.elearning.bffservice.dto.response.AvailabilityResponse;
import com.elearning.bffservice.dto.response.BookedSessionResponse;
import com.elearning.bffservice.dto.response.StudentResponse;
import com.elearning.bffservice.dto.response.StudentDetailResponse;
import com.elearning.bffservice.dto.response.ClassResponse;
import com.elearning.bffservice.dto.response.TutorSearchResponse;
import com.elearning.bffservice.dto.response.TutorProfileResponse;
import com.elearning.bffservice.dto.response.enums.ScheduleStatus;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface TutorService {
    Page<TutorSearchResponse> searchTutors(List<String> languageCodes, BigDecimal minPrice, BigDecimal maxPrice, UUID categoryId, boolean categoryIsParent, List<String> availableDays, int page, int size);
    
    /**
     * Get tutor students with filtering and pagination
     * @param tutorId Tutor ID
     * @param page Page number
     * @param limit Page size
     * @param status Filter by status: "Ongoing" or "Completed"
     * @param enrollmentType Filter by enrollment type: "1-on-1", "Group", or "Trial"
     * @param search Search by name or email
     * @return Page of students
     */
    Page<StudentResponse> getTutorStudents(UUID tutorId, int page, int limit, String status, String enrollmentType, String search);
    
    /**
     * Get detailed information about a specific student
     * @param tutorId Tutor ID
     * @param studentId Student ID
     * @return Detailed student information
     */
    StudentDetailResponse getStudentDetail(UUID tutorId, UUID studentId);
    
    /**
     * Get all classes of a tutor with pagination
     * @param tutorId Tutor ID
     * @param page Page number
     * @param limit Page size
     * @return Page of classes
     */
    Page<ClassResponse> getClasses(UUID tutorId, int page, int limit);
    
    /**
     * Get tutor profile with aggregated data from multiple services
     * @param tutorId Tutor ID
     * @return Tutor profile information
     */
    TutorProfileResponse getTutorProfile(UUID tutorId);
    
    /**
     * Get booked sessions for a tutor with student details
     * @param tutorId Tutor ID
     * @param startDate Start date (inclusive)
     * @param endDate End date (inclusive)
     * @param statuses Optional list of statuses to filter by
     * @return List of booked sessions with student information
     */
    List<BookedSessionResponse> getBookedSessions(UUID tutorId, LocalDate startDate, LocalDate endDate, List<ScheduleStatus> statuses);
    
    /**
     * Get availability patterns for a tutor
     * @param tutorId Tutor ID
     * @param startDate Start date
     * @param endDate End date
     * @return List of recurring availability patterns
     */
    List<AvailabilityResponse> getAvailabilities(UUID tutorId, LocalDate startDate, LocalDate endDate);
    
    /**
     * Bulk update availability
     * @param tutorId Tutor ID
     * @param request Bulk update request
     */
    void bulkUpdateAvailability(UUID tutorId, BulkUpdateAvailabilityRequest request);
}
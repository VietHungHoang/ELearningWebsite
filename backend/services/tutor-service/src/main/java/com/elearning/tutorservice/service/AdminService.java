package com.elearning.tutorservice.service;

import com.elearning.tutorservice.dto.response.NewStudentsResponse;
import com.elearning.tutorservice.dto.response.NewTutorsResponse;
import com.elearning.tutorservice.dto.response.TutorPendingApprovalsResponse;

import java.time.LocalDate;

/**
 * Service for admin operations
 */
public interface AdminService {

    /**
     * Get tutor pending approvals statistics
     */
    TutorPendingApprovalsResponse getTutorPendingApprovals(LocalDate startDate, LocalDate endDate);

    /**
     * Get new students statistics
     */
    NewStudentsResponse getNewStudents(LocalDate startDate, LocalDate endDate);

    /**
     * Get new tutors statistics
     */
    NewTutorsResponse getNewTutors(LocalDate startDate, LocalDate endDate);
}
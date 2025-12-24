package com.elearning.bffservice.service;

import com.elearning.bffservice.dto.request.BulkUpdateAvailabilityRequest;
import com.elearning.bffservice.dto.request.UpdateOnboardingRequest;
import com.elearning.bffservice.dto.student.response.StudentResponse;
import com.elearning.bffservice.dto.response.StudentDetailResponse;
import com.elearning.bffservice.dto.response.ClassResponse;
import com.elearning.bffservice.dto.response.OnboardingResponse;
import com.elearning.bffservice.dto.tutor.response.AvailabilityListResponse;
import com.elearning.bffservice.bff.tutors.response.TutorDetailBffResponse;
import com.elearning.bffservice.dto.tutor.request.GetTutorStudentsRequest;
import com.elearning.bffservice.dto.tutor.response.TutorDashboardChartsResponse;

import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.UUID;

public interface TutorService {
    Page<StudentResponse> getTutorStudents(UUID tutorId, GetTutorStudentsRequest request);

    StudentDetailResponse getStudentDetail(UUID tutorId, UUID studentId);
    
    Page<ClassResponse> getClasses(UUID tutorId, int page, int limit);

    AvailabilityListResponse getAvailabilities(UUID tutorId, LocalDate startDate, LocalDate endDate);
    
    void bulkUpdateAvailability(UUID tutorId, BulkUpdateAvailabilityRequest request);
    
    OnboardingResponse getOnboarding(UUID tutorId);
    
    void updateOnboarding(UUID tutorId, UpdateOnboardingRequest request);

    TutorDetailBffResponse getTutorDetail(UUID tutorId, UUID studentId);

    TutorDashboardChartsResponse getDashboardCharts(UUID tutorId);
}
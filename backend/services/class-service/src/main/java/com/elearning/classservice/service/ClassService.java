package com.elearning.classservice.service;

import com.elearning.classservice.dto.request.CreateClassBookingRequest;
import com.elearning.classservice.dto.request.CreateClassRequest;
import com.elearning.classservice.dto.response.ClassTableItem;
import com.elearning.classservice.dto.response.CreateClassBookingResponse;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface ClassService {

    /**
     * Get class table for tutor dashboard
     * @param tutorId Tutor ID
     * @param status Optional status filter
     * @param page Page number
     * @param size Page size
     * @return Page of ClassTableItem
     */
    Page<ClassTableItem> getMyClass(UUID tutorId, String status, int page, int size);

    /**
     * Get class table for student dashboard
     * @param studentId Student ID
     * @param status Optional status filter
     * @param page Page number
     * @param size Page size
     * @return Page of ClassTableItem
     */
    Page<ClassTableItem> getMyClassesAsStudent(UUID studentId, String status, int page, int size);

    /**
     * Create a new class for tutor
     * @param tutorId Tutor ID
     * @param request Create class request
     */
    void createClass(UUID tutorId, CreateClassRequest request);

    /**
     * Create a class booking (class, enrollment, sessions)
     * @param request Create class booking request
     * @return Create class booking response with classId
     */
    CreateClassBookingResponse createClassBooking(CreateClassBookingRequest request);
}
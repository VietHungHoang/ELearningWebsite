package com.elearning.classservice.service;

import com.elearning.classservice.dto.request.CreateClassBookingRequest;
import com.elearning.classservice.dto.request.CreateClassRequest;
import com.elearning.classservice.dto.request.UpdateClassRequest;
import com.elearning.classservice.dto.response.ClassDetailResponse;
import com.elearning.classservice.dto.response.ClassTableItem;
import com.elearning.classservice.dto.response.CreateClassBookingResponse;
import com.elearning.classservice.dto.response.OpeningClassResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface ClassService {

    /**
     * Get all classes with pagination
     * @param page Page number
     * @param size Page size
     * @return Page of ClassTableItem
     */
    Page<ClassTableItem> getAllClasses(int page, int size);

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

    /**
     * Get class detail by classId for tutor
     * @param classId Class ID
     * @param tutorId Tutor ID (for authorization)
     * @return ClassDetailResponse
     */
    ClassDetailResponse getClassDetail(UUID classId, UUID tutorId);

    /**
     * Update class information
     * @param classId Class ID
     * @param tutorId Tutor ID (for authorization)
     * @param request Update class request
     */
    void updateClass(UUID classId, UUID tutorId, UpdateClassRequest request);

    /**
     * Delete class
     * @param classId Class ID
     * @param tutorId Tutor ID (for authorization)
     */
    void deleteClass(UUID classId, UUID tutorId);

    /**
     * Get all opening classes by tutor
     * @param tutorId Tutor ID
     * @return List of OpeningClassResponse
     */
    List<OpeningClassResponse> getOpeningClasses(UUID tutorId);

    /**
     * Add student to class
     * @param classId Class ID
     * @param studentId Student ID
     * @param tutorId Tutor ID (for authorization)
     */
    void addStudentToClass(UUID classId, UUID studentId, UUID tutorId);

    /**
     * Remove student from class
     * @param classId Class ID
     * @param studentId Student ID
     * @param tutorId Tutor ID (for authorization)
     */
    void removeStudentFromClass(UUID classId, UUID studentId, UUID tutorId);
}
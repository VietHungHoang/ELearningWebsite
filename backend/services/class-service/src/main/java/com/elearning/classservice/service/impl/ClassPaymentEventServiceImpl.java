package com.elearning.classservice.service.impl;

import com.elearning.classservice.dto.event.BookingPaymentFailedEvent;
import com.elearning.classservice.dto.event.BookingPaymentSuccessEvent;
import com.elearning.classservice.dto.zoom.response.ZoomMeetingResponse;
import com.elearning.classservice.entity.ClassEnrollment;
import com.elearning.classservice.entity.ClassEntity;
import com.elearning.classservice.entity.Session;
import com.elearning.classservice.entity.enums.ClassStatus;
import com.elearning.classservice.entity.enums.ScheduleStatus;
import com.elearning.classservice.repository.ClassEnrollmentRepository;
import com.elearning.classservice.repository.ClassRepository;
import com.elearning.classservice.repository.SessionRepository;
import com.elearning.classservice.service.ClassPaymentEventService;
import com.elearning.classservice.service.ZoomMeetingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClassPaymentEventServiceImpl implements ClassPaymentEventService {

    private final ClassRepository classRepository;
    private final SessionRepository sessionRepository;
    private final ClassEnrollmentRepository enrollmentRepository;
    private final ZoomMeetingService zoomMeetingService;

    @Override
    @Transactional
    public void handlePaymentSuccess(BookingPaymentSuccessEvent event) {
        log.info("Handling payment success for bookingId: {}, classId: {}", event.getBookingId(), event.getClassId());

        if (event.getClassId() == null) {
            log.info("ClassId is null, creating new class for bookingId: {}", event.getBookingId());
            createNewClass(event);
            return;
        }

        // Find class by ID
        ClassEntity classEntity = classRepository.findById(event.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found: " + event.getClassId()));

        // Update class status to IN_PROGRESS
        classEntity.setStatus(ClassStatus.IN_PROGRESS);
        classRepository.save(classEntity);

        log.info("Updated class {} status to IN_PROGRESS after payment success", event.getClassId());

        // Create Zoom meeting links for all sessions of this class
        createZoomMeetingsForClass(classEntity);
    }

    private void createNewClass(BookingPaymentSuccessEvent event) {
        log.info("Creating new class for booking: {}", event.getBookingId());

        // 1. Create Class Entity
        ClassEntity newClass = ClassEntity.builder()
                .title("Lớp học 1-1 " + (event.getNotes() != null ? event.getNotes() : ""))
                .tutor(com.elearning.classservice.entity.User.builder().id(event.getTutorId()).build()) // Setup proxy user reference
                .status(ClassStatus.IN_PROGRESS)
                .classType(com.elearning.classservice.entity.enums.ClassType.ONE_ON_ONE)
                .build();
        
        newClass = classRepository.save(newClass);
        log.info("Created new class entity with ID: {}", newClass.getId());

        // 2. Create Sessions from Schedule
        if (event.getSchedule() != null) {
            createSessionsFromSchedule(newClass, event.getSchedule());
        }

        // 3. Create Enrollment
        ClassEnrollment enrollment = ClassEnrollment.builder()
                .classEntity(newClass)
                .student(com.elearning.classservice.entity.User.builder().id(event.getStudentId()).build())
                .status(com.elearning.classservice.entity.enums.EnrollmentStatus.ACTIVE)
                .enrolledAt(java.time.LocalDateTime.now())
                .build();
        
        enrollmentRepository.save(enrollment);
        log.info("Enrolled student {} to class {}", event.getStudentId(), newClass.getId());

        // 4. Create Zoom Meetings
        createZoomMeetingsForClass(newClass);
    }

    private void createSessionsFromSchedule(ClassEntity classEntity, String scheduleJson) {
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            // Assuming schedule is a JSON array of objects with "time" field or just ISO strings
            // Based on CreateBookingRequest it's List<ScheduleItem> where ScheduleItem has "time"
            com.fasterxml.jackson.core.type.TypeReference<List<java.util.Map<String, String>>> typeRef = 
                new com.fasterxml.jackson.core.type.TypeReference<>() {};
            
            List<java.util.Map<String, String>> scheduleItems = mapper.readValue(scheduleJson, typeRef);
            
            for (java.util.Map<String, String> item : scheduleItems) {
                String timeStr = item.get("time");
                if (timeStr != null) {
                    java.time.LocalDateTime startTime = java.time.LocalDateTime.parse(timeStr, java.time.format.DateTimeFormatter.ISO_DATE_TIME);
                    
                    Session session = Session.builder()
                            .classEntity(classEntity)
                            .title("Buổi học")
                            .startTime(startTime)
                            .endTime(startTime.plusMinutes(60)) // Default 60 mins duration
                            .status(ScheduleStatus.PENDING)
                            .build();
                    
                    sessionRepository.save(session);
                }
            }
            log.info("Created {} sessions for class {}", scheduleItems.size(), classEntity.getId());
        } catch (Exception e) {
            log.error("Failed to parse schedule JSON: {}", scheduleJson, e);
        }
    }

    /**
     * Create Zoom meetings for all sessions of a class
     */
    private void createZoomMeetingsForClass(ClassEntity classEntity) {
        log.info("Creating Zoom meetings for class {}", classEntity.getId());

        try {
            // Get all sessions for this class
            List<Session> sessions = sessionRepository.findByClassEntityIdOrderByStartTimeAsc(classEntity.getId());

            if (sessions.isEmpty()) {
                log.warn("No sessions found for class {}", classEntity.getId());
                return;
            }

            UUID tutorId = classEntity.getTutor().getId();
            int successCount = 0;
            int failCount = 0;

            for (Session session : sessions) {
                try {
                    // Skip if Zoom meeting already exists
                    if (session.getZoomMeetingId() != null && !session.getZoomMeetingId().isEmpty()) {
                        log.info("Session {} already has Zoom meeting ID: {}", session.getId(), session.getZoomMeetingId());
                        continue;
                    }

                    // Create Zoom meeting
                    ZoomMeetingResponse zoomMeeting = zoomMeetingService.createScheduledMeeting(tutorId, session.getId());

                    // Update session with Zoom details
                    session.setZoomMeetingId(String.valueOf(zoomMeeting.getId()));
                    session.setZoomPassword(zoomMeeting.getPassword());
                    session.setZoomJoinUrl(zoomMeeting.getJoinUrl());
                    session.setMeetingLink(zoomMeeting.getJoinUrl());

                    sessionRepository.save(session);

                    successCount++;
                    log.info("Created Zoom meeting for session {}: {}", session.getId(), zoomMeeting.getId());

                } catch (Exception e) {
                    failCount++;
                    log.error("Failed to create Zoom meeting for session {}: {}", session.getId(), e.getMessage(), e);
                    // Continue with next session even if one fails
                }
            }

            log.info("Zoom meeting creation completed for class {}. Success: {}, Failed: {}", 
                    classEntity.getId(), successCount, failCount);

        } catch (Exception e) {
            log.error("Error creating Zoom meetings for class {}: {}", classEntity.getId(), e.getMessage(), e);
            // Don't throw exception - class is already in IN_PROGRESS status
        }
    }

    @Override
    @Transactional
    public void handlePaymentFailed(BookingPaymentFailedEvent event) {
        log.info("Handling payment failed for bookingId: {}, classId: {}, reason: {}", 
                event.getBookingId(), event.getClassId(), event.getReason());

        if (event.getClassId() == null) {
            log.warn("ClassId is null in payment failed event for bookingId: {}", event.getBookingId());
            return;
        }

        // Find class by ID
        ClassEntity classEntity = classRepository.findById(event.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found: " + event.getClassId()));

        // SAGA Rollback: Xử lý rollback dựa trên trạng thái của sessions
        rollbackFailedPayment(classEntity);

        log.info("Completed rollback for class {} due to payment failure", event.getClassId());
    }

    /**
     * Rollback logic when payment fails
     * - Xóa tất cả sessions PENDING (sessions mới được tạo cho booking này)
     * - Nếu sau khi xóa không còn sessions nào -> Đây là booking MUA MỚI -> Xóa class và enrollment
     * - Nếu sau khi xóa vẫn còn sessions -> Đây là booking MUA THÊM -> Giữ lại class và enrollment
     */
    private void rollbackFailedPayment(ClassEntity classEntity) {
        UUID classId = classEntity.getId();
        
        log.info("Starting rollback for class {}", classId);

        // 1. Get all PENDING sessions (sessions chưa được thanh toán)
        List<Session> pendingSessions = sessionRepository.findByClassEntityIdAndStatus(classId, ScheduleStatus.PENDING);
        
        log.info("Found {} PENDING sessions to delete for class {}", pendingSessions.size(), classId);

        // 2. Delete all PENDING sessions
        if (!pendingSessions.isEmpty()) {
            sessionRepository.deleteAll(pendingSessions);
            log.info("Deleted {} PENDING sessions for class {}", pendingSessions.size(), classId);
        }

        // 3. Check remaining sessions
        List<Session> remainingSessions = sessionRepository.findByClassEntityIdOrderByStartTimeAsc(classId);
        
        log.info("Remaining sessions after deletion: {} for class {}", remainingSessions.size(), classId);

        // 4. Decide rollback strategy
        if (remainingSessions.isEmpty()) {
            // Case: MUA MỚI - Không còn sessions nào -> Xóa toàn bộ class và enrollments
            log.info("No remaining sessions. This is a NEW PURCHASE. Deleting class and enrollments for class {}", classId);
            
            // Delete all enrollments
            List<ClassEnrollment> enrollments = enrollmentRepository.findByClassEntityId(classId);
            if (!enrollments.isEmpty()) {
                enrollmentRepository.deleteAll(enrollments);
                log.info("Deleted {} enrollments for class {}", enrollments.size(), classId);
            }
            
            // Delete class entity
            classRepository.delete(classEntity);
            log.info("Deleted class entity {} (NEW PURCHASE rollback)", classId);
            
        } else {
            // Case: MUA THÊM - Vẫn còn sessions -> Chỉ xóa sessions PENDING, giữ lại class và enrollment
            log.info("Found {} remaining sessions. This is an ADD MORE HOURS. Keeping class and enrollments for class {}", 
                    remainingSessions.size(), classId);
            
            // Optionally: Update class status if needed
            // Nếu class đang ở trạng thái CREATED, có thể rollback về trạng thái trước đó
            if (classEntity.getStatus() == ClassStatus.CREATED) {
                classEntity.setStatus(ClassStatus.IN_PROGRESS);
                classRepository.save(classEntity);
                log.info("Reverted class {} status to IN_PROGRESS", classId);
            }
        }
    }
}

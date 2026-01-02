package com.elearning.classservice.service.impl;

import com.elearning.classservice.dto.response.ScheduleInfo;
import com.elearning.classservice.dto.request.CreateClassRequest;
import com.elearning.classservice.dto.request.CreateClassBookingRequest;
import com.elearning.classservice.dto.request.UpdateClassRequest;
import com.elearning.classservice.dto.response.ClassDetailResponse;
import com.elearning.classservice.dto.response.ClassTableItem;
import com.elearning.classservice.dto.response.CreateClassBookingResponse;
import com.elearning.classservice.dto.response.UserInfoResponse;
import com.elearning.classservice.entity.ClassEnrollment;
import com.elearning.classservice.entity.ClassEntity;
import com.elearning.classservice.entity.ClassSchedule;
import com.elearning.classservice.entity.Session;
import com.elearning.classservice.entity.User;
import com.elearning.classservice.entity.enums.ClassStatus;
import com.elearning.classservice.entity.enums.ClassType;
import com.elearning.classservice.entity.enums.EnrollmentStatus;
import com.elearning.classservice.entity.enums.ScheduleStatus;
import com.elearning.classservice.repository.ClassEnrollmentRepository;
import com.elearning.classservice.repository.ClassRepository;
import com.elearning.classservice.repository.SessionRepository;
import com.elearning.classservice.service.ClassService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClassServiceImpl implements ClassService {

    private final ClassRepository classRepository;
    private final ClassEnrollmentRepository classEnrollmentRepository;
    private final SessionRepository sessionRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<ClassTableItem> getMyClass(UUID tutorId, String status, int page, int size) {
        log.info("Getting classes for tutorId: {}, status: {}, page: {}, size: {}", tutorId, status, page, size);
        
        // Convert 1-based page to 0-based page index
        int pageIndex = page > 0 ? page - 1 : 0;
        log.info("Converted page {} to pageIndex {}", page, pageIndex);
        
        Pageable pageable = PageRequest.of(pageIndex, size);
        Page<ClassEntity> classPage;

        if (status != null && !status.trim().isEmpty()) {
            ClassStatus classStatus = ClassStatus.valueOf(status.toUpperCase());
            classPage = classRepository.findByTutorIdAndStatus(tutorId, classStatus, pageable);
            log.info("Found {} classes with status {}", classPage.getTotalElements(), classStatus);
        } else {
            classPage = classRepository.findByTutorId(tutorId, pageable);
            log.info("Found {} total classes", classPage.getTotalElements());
        }

        log.info("classPage.getContent() size: {}", classPage.getContent().size());
        
        List<ClassTableItem> items = classPage.getContent().stream()
                .map(classEntity -> {
                    log.info("=== Processing class: {} ({})", classEntity.getId(), classEntity.getTitle());
                    
                    try {
                        // Get students
                        List<ClassEnrollment> enrollments =
                            classEnrollmentRepository.findByClassEntityIdAndStatus(classEntity.getId(), EnrollmentStatus.ON_GOING);
                        log.info("Class {} has {} enrollments", classEntity.getId(), enrollments.size());
                        
                        List<UserInfoResponse> students = enrollments.stream()
                                .map(enrollment -> {
                                    log.info("Mapping student: {} - {}", enrollment.getStudent().getId(), enrollment.getStudent().getFullName());
                                    return UserInfoResponse.builder()
                                            .id(enrollment.getStudent().getId().toString())
                                            .fullName(enrollment.getStudent().getFullName())
                                            .avatarUrl(enrollment.getStudent().getAvatarUrl())
                                            .build();
                                })
                                .collect(Collectors.toList());
                        log.info("Mapped {} students", students.size());

                        // Get schedules
                        List<ClassSchedule> schedules = classEntity.getSchedules();
                        log.info("Class {} has {} schedules (raw)", classEntity.getId(), schedules != null ? schedules.size() : "null");
                        
                        List<ScheduleInfo> scheduleInfos = schedules.stream()
                                .map(schedule -> {
                                    log.info("Mapping schedule: dayOfWeek={}, startTime={}", schedule.getDayOfWeek(), schedule.getStartTime());
                                    return ScheduleInfo.builder()
                                            .dayOfWeek(schedule.getDayOfWeek())
                                            .time(schedule.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                                            .build();
                                })
                                .collect(Collectors.toList());
                        log.info("Mapped {} schedules", scheduleInfos.size());

                        // Get sessions count
                        long completedSessions = sessionRepository.countByClassEntityIdAndStatus(classEntity.getId(), ScheduleStatus.ACCEPTED);
                        long totalSessions = sessionRepository.countByClassEntityId(classEntity.getId());
                        log.info("Class {} has {}/{} completed sessions", classEntity.getId(), completedSessions, totalSessions);

                        ClassTableItem item = ClassTableItem.builder()
                                .id(classEntity.getId().toString())
                                .title(classEntity.getTitle())
                                .students(students)
                                .type(classEntity.getClassType().name())
                                .status(classEntity.getStatus().name())
                                .schedules(scheduleInfos)
                                .startDate(classEntity.getCreatedAt().toLocalDate().toString())
                                .completedSessions((int) completedSessions)
                                .totalSessions((int) totalSessions)
                                .build();
                        
                        log.info("Successfully built ClassTableItem: {}", item.getId());
                        return item;
                    } catch (Exception e) {
                        log.error("ERROR processing class {}: {}", classEntity.getId(), e.getMessage(), e);
                        throw new RuntimeException("Failed to process class: " + classEntity.getId(), e);
                    }
                })
                .collect(Collectors.toList());

        log.info("Stream collected {} items", items.size());
        log.info("Returning {} class items out of {} total", items.size(), classPage.getTotalElements());
        return new PageImpl<>(items, pageable, classPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ClassTableItem> getMyClassesAsStudent(UUID studentId, String status, int page, int size) {
        // Convert 1-based page to 0-based page index
        int pageIndex = page > 0 ? page - 1 : 0;
        
        Pageable pageable = PageRequest.of(pageIndex, size);

        // Get enrollments for this student
        Page<ClassEnrollment> enrollmentPage;
        if (status != null && !status.trim().isEmpty()) {
            EnrollmentStatus enrollmentStatus = EnrollmentStatus.valueOf(status.toUpperCase());
            enrollmentPage = classEnrollmentRepository.findByStudentIdAndStatus(studentId, enrollmentStatus, pageable);
        } else {
            enrollmentPage = classEnrollmentRepository.findByStudentId(studentId, pageable);
        }

        List<ClassTableItem> items = enrollmentPage.getContent().stream()
                .map(enrollment -> {
                    ClassEntity classEntity = enrollment.getClassEntity();

                    // Get tutor info
                    List<UserInfoResponse> tutors = List.of(UserInfoResponse.builder()
                            .id(classEntity.getTutor().getId().toString())
                            .fullName(classEntity.getTutor().getFullName())
                            .avatarUrl(classEntity.getTutor().getAvatarUrl())
                            .build());

                    // Get schedules
                    List<ClassSchedule> schedules = classEntity.getSchedules();
                    List<ScheduleInfo> scheduleInfos = schedules.stream()
                            .map(schedule -> ScheduleInfo.builder()
                                    .dayOfWeek(schedule.getDayOfWeek())
                                    .time(schedule.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                                    .build())
                            .collect(Collectors.toList());

                    // Get sessions count
                    long completedSessions = sessionRepository.countByClassEntityIdAndStatus(classEntity.getId(), ScheduleStatus.ACCEPTED);
                    long totalSessions = sessionRepository.countByClassEntityId(classEntity.getId());

                    return ClassTableItem.builder()
                            .id(classEntity.getId().toString())
                            .title(classEntity.getTitle())
                            .students(tutors) // For student view, show tutor info
                            .type(classEntity.getClassType().name())
                            .status(enrollment.getStatus().name()) // Use enrollment status
                            .schedules(scheduleInfos)
                            .startDate(classEntity.getCreatedAt().toLocalDate().toString())
                            .completedSessions((int) completedSessions)
                            .totalSessions((int) totalSessions)
                            .build();
                })
                .collect(Collectors.toList());

        return new PageImpl<>(items, pageable, enrollmentPage.getTotalElements());
    }

    @Override
    @Transactional
    public void createClass(UUID tutorId, CreateClassRequest request) {
        // Create schedules
        List<ClassSchedule> schedules = request.getSchedules().stream()
                .map(scheduleReq -> ClassSchedule.builder()
                        .dayOfWeek(scheduleReq.getDayOfWeek())
                        .startTime(LocalTime.parse(scheduleReq.getTime()))
                        .durationMinutes(60)
                        .build())
                .collect(Collectors.toList());

        // Create class entity
        ClassEntity classEntity = ClassEntity.builder()
                .tutor(User.builder().id(tutorId).build())
                .title(request.getTitle())
                .description(request.getDescription())
                .subjectId(UUID.fromString(request.getSubjectId()))
                .classType(ClassType.GROUP)
                .maxStudents(request.getMaxStudents())
                .pricePerHour(request.getTuitionFee())
                .status(ClassStatus.OPENING)
                .schedules(schedules)
                .build();

        // Set classEntity for schedules
        schedules.forEach(schedule -> schedule.setClassEntity(classEntity));

        // Save
        classRepository.save(classEntity);
    }

    @Override
    @Transactional
    public CreateClassBookingResponse createClassBooking(CreateClassBookingRequest request) {
        log.info("Creating class booking for student: {}, tutor: {}", request.getStudentId(), request.getTutorId());

        // Create ClassEntity
        ClassEntity classEntity = ClassEntity.builder()
                .tutor(User.builder().id(request.getTutorId()).build())
                .title("Booked Class")
                .classType(ClassType.ONE_ON_ONE)
                .maxStudents(1)
                .pricePerHour(request.getPricePerHour().doubleValue())
                .status(ClassStatus.DRAFT)
                .build();

        classEntity = classRepository.save(classEntity);
        log.info("Created class with ID: {}", classEntity.getId());

        // Create ClassEnrollment
        ClassEnrollment enrollment = ClassEnrollment.builder()
                .classEntity(classEntity)
                .student(User.builder().id(request.getStudentId()).build())
                .status(EnrollmentStatus.PENDING)
                .build();

        classEnrollmentRepository.save(enrollment);
        log.info("Created enrollment for student: {} in class: {}", request.getStudentId(), classEntity.getId());

        // Create Sessions from schedule
        for (int i = 0; i < request.getSchedule().size(); i++) {
            CreateClassBookingRequest.ScheduleItem scheduleItem = request.getSchedule().get(i);

            // Parse time string to LocalDateTime - assuming ISO format
            LocalDateTime startTime = LocalDateTime.parse(scheduleItem.getTime());
            LocalDateTime endTime = startTime.plusHours(1); // Default 1 hour session

            Session session = Session.builder()
                    .classEntity(classEntity)
                    .tutor(User.builder().id(request.getTutorId()).build())
                    .sessionNumber(i + 1)
                    .title("Session " + (i + 1))
                    .startTime(startTime)
                    .endTime(endTime)
                    .isTrial(false)
                    .status(ScheduleStatus.PENDING)
                    .build();

            sessionRepository.save(session);
        }

        log.info("Created {} sessions for class: {}", request.getSchedule().size(), classEntity.getId());

        return CreateClassBookingResponse.builder()
                .classId(classEntity.getId())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ClassDetailResponse getClassDetail(UUID classId, UUID tutorId) {
        log.info("Getting class detail for classId: {}, tutorId: {}", classId, tutorId);
        
        // Find class and verify tutor ownership
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));
        
        if (!classEntity.getTutor().getId().equals(tutorId)) {
            throw new RuntimeException("Unauthorized: You are not the tutor of this class");
        }
        
        // Map tutor info
        ClassDetailResponse.TutorInfo tutorInfo = ClassDetailResponse.TutorInfo.builder()
                .id(classEntity.getTutor().getId())
                .fullName(classEntity.getTutor().getFullName())
                .avatarUrl(classEntity.getTutor().getAvatarUrl())
                .build();
        
        // Map students
        List<ClassDetailResponse.StudentInfo> students = classEntity.getEnrollments().stream()
                .map(enrollment -> ClassDetailResponse.StudentInfo.builder()
                        .id(enrollment.getStudent().getId())
                        .fullName(enrollment.getStudent().getFullName())
                        .avatarUrl(enrollment.getStudent().getAvatarUrl())
                        .enrollmentStatus(enrollment.getStatus().name())
                        .build())
                .collect(Collectors.toList());
        
        // Map schedules
        List<ClassDetailResponse.ScheduleInfo> schedules = classEntity.getSchedules().stream()
                .map(schedule -> ClassDetailResponse.ScheduleInfo.builder()
                        .dayOfWeek(schedule.getDayOfWeek())
                        .time(schedule.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                        .durationMinutes(schedule.getDurationMinutes())
                        .build())
                .collect(Collectors.toList());
        
        // Map sessions
        List<ClassDetailResponse.SessionInfo> sessions = classEntity.getSessions().stream()
                .map(session -> ClassDetailResponse.SessionInfo.builder()
                        .id(session.getId())
                        .sessionNumber(session.getSessionNumber())
                        .title(session.getTitle())
                        .startTime(session.getStartTime())
                        .endTime(session.getEndTime())
                        .meetingLink(session.getMeetingLink())
                        .status(session.getStatus().name())
                        .participantsCount(session.getParticipants() != null ? session.getParticipants().size() : 0)
                        .build())
                .collect(Collectors.toList());
        
        // Map materials
        List<ClassDetailResponse.MaterialInfo> materials = classEntity.getMaterials().stream()
                .map(material -> ClassDetailResponse.MaterialInfo.builder()
                        .id(material.getId())
                        .name(material.getName())
                        .type(material.getType())
                        .s3Url(material.getS3Url())
                        .uploadDate(material.getUploadDate())
                        .fileSize(material.getFileSize())
                        .description(material.getDescription())
                        .build())
                .collect(Collectors.toList());
        
        // Map announcements
        List<ClassDetailResponse.AnnouncementInfo> announcements = classEntity.getAnnouncements().stream()
                .map(announcement -> ClassDetailResponse.AnnouncementInfo.builder()
                        .id(announcement.getId())
                        .title(announcement.getTitle())
                        .content(announcement.getContent())
                        .date(announcement.getDate())
                        .author(announcement.getAuthor())
                        .build())
                .collect(Collectors.toList());
        
        // Map assignments
        List<ClassDetailResponse.AssignmentInfo> assignments = classEntity.getAssignments().stream()
                .map(assignment -> ClassDetailResponse.AssignmentInfo.builder()
                        .id(assignment.getId())
                        .title(assignment.getTitle())
                        .description(assignment.getDescription())
                        .dueDate(assignment.getDueDate())
                        .submissionsCount(assignment.getSubmissionsCount())
                        .build())
                .collect(Collectors.toList());
        
        // Calculate stats
        long totalStudents = classEntity.getEnrollments().size();
        long activeStudents = classEntity.getEnrollments().stream()
                .filter(e -> e.getStatus() == EnrollmentStatus.ON_GOING)
                .count();
        long completedSessions = sessionRepository.countByClassEntityIdAndStatus(classId, ScheduleStatus.ACCEPTED);
        long totalSessions = sessionRepository.countByClassEntityId(classId);
        double completionRate = totalSessions > 0 ? (completedSessions * 100.0 / totalSessions) : 0.0;
        
        ClassDetailResponse.StatsInfo stats = ClassDetailResponse.StatsInfo.builder()
                .totalStudents((int) totalStudents)
                .activeStudents((int) activeStudents)
                .completedSessions((int) completedSessions)
                .totalSessions((int) totalSessions)
                .completionRate(completionRate)
                .build();
        
        log.info("Class detail retrieved successfully for classId: {}", classId);
        
        return ClassDetailResponse.builder()
                .id(classEntity.getId())
                .title(classEntity.getTitle())
                .description(classEntity.getDescription())
                .subjectId(classEntity.getSubjectId())
                .type(classEntity.getClassType().name())
                .status(classEntity.getStatus().name())
                .maxStudents(classEntity.getMaxStudents())
                .pricePerHour(classEntity.getPricePerHour())
                .createdAt(classEntity.getCreatedAt())
                .tutor(tutorInfo)
                .students(students)
                .schedules(schedules)
                .sessions(sessions)
                .completedSessions((int) completedSessions)
                .totalSessions((int) totalSessions)
                .materials(materials)
                .announcements(announcements)
                .assignments(assignments)
                .stats(stats)
                .build();
    }

    @Override
    @Transactional
    public void updateClass(UUID classId, UUID tutorId, UpdateClassRequest request) {
        log.info("Updating class: {}, tutorId: {}", classId, tutorId);
        
        // Find class and verify tutor ownership
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));
        
        if (!classEntity.getTutor().getId().equals(tutorId)) {
            throw new RuntimeException("Unauthorized: You are not the tutor of this class");
        }
        
        // Update basic info
        if (request.getTitle() != null) {
            classEntity.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            classEntity.setDescription(request.getDescription());
        }
        if (request.getSubjectId() != null) {
            classEntity.setSubjectId(UUID.fromString(request.getSubjectId()));
        }
        if (request.getPricePerHour() != null) {
            classEntity.setPricePerHour(request.getPricePerHour());
        }
        if (request.getMaxStudents() != null) {
            classEntity.setMaxStudents(request.getMaxStudents());
        }
        if (request.getStatus() != null) {
            classEntity.setStatus(ClassStatus.valueOf(request.getStatus().toUpperCase()));
        }
        
        // Update schedules if provided
        if (request.getSchedules() != null && !request.getSchedules().isEmpty()) {
            // Remove old schedules
            classEntity.getSchedules().clear();
            
            // Add new schedules
            List<ClassSchedule> newSchedules = request.getSchedules().stream()
                    .map(scheduleReq -> ClassSchedule.builder()
                            .classEntity(classEntity)
                            .dayOfWeek(scheduleReq.getDayOfWeek())
                            .startTime(LocalTime.parse(scheduleReq.getTime()))
                            .durationMinutes(60)
                            .build())
                    .collect(Collectors.toList());
            
            classEntity.getSchedules().addAll(newSchedules);
        }
        
        classRepository.save(classEntity);
        log.info("Class updated successfully: {}", classId);
    }

    @Override
    @Transactional
    public void deleteClass(UUID classId, UUID tutorId) {
        log.info("Deleting class: {}, tutorId: {}", classId, tutorId);
        
        // Find class and verify tutor ownership
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));
        
        if (!classEntity.getTutor().getId().equals(tutorId)) {
            throw new RuntimeException("Unauthorized: You are not the tutor of this class");
        }
        
        // Check if class can be deleted (e.g., not in progress)
        if (classEntity.getStatus() == ClassStatus.IN_PROGRESS) {
            throw new RuntimeException("Cannot delete class that is in progress");
        }
        
        classRepository.delete(classEntity);
        log.info("Class deleted successfully: {}", classId);
    }
}
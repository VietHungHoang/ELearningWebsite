package com.elearning.classservice.service.impl;

import com.elearning.classservice.dto.response.ScheduleInfo;
import com.elearning.classservice.dto.request.CreateClassRequest;
import com.elearning.classservice.dto.request.CreateClassBookingRequest;
import com.elearning.classservice.dto.response.ClassTableItem;
import com.elearning.classservice.dto.response.CreateClassBookingResponse;
import com.elearning.classservice.dto.response.UserInfoResponse;
import com.elearning.classservice.entity.ClassEnrollment;
import com.elearning.classservice.entity.ClassEntity;
import com.elearning.classservice.entity.ClassSchedule;
import com.elearning.classservice.entity.Session;
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

import java.time.DayOfWeek;
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
        Pageable pageable = PageRequest.of(page, size);
        Page<ClassEntity> classPage;

        if (status != null && !status.trim().isEmpty()) {
            ClassStatus classStatus = ClassStatus.valueOf(status.toUpperCase());
            classPage = classRepository.findByTutorIdAndStatus(tutorId, classStatus, pageable);
        } else {
            classPage = classRepository.findByTutorId(tutorId, pageable);
        }

        List<ClassTableItem> items = classPage.getContent().stream()
                .map(classEntity -> {
                    // Get students
                    List<ClassEnrollment> enrollments =
                        classEnrollmentRepository.findByClassEntityIdAndStatus(classEntity.getId(), EnrollmentStatus.ON_GOING);
                    List<UserInfoResponse> students = enrollments.stream()
                            .map(enrollment -> UserInfoResponse.builder()
                                    .id(enrollment.getStudentId().toString())
                                    .fullName(enrollment.getStudentName())
                                    .avatarUrl("")
                                    .build())
                            .collect(Collectors.toList());

                    // Get schedules
                    List<ClassSchedule> schedules = classEntity.getSchedules();
                    List<ScheduleInfo> scheduleInfos = schedules.stream()
                            .map(schedule -> ScheduleInfo.builder()
                                    .dayOfWeek(Integer.parseInt(schedule.getDayOfWeek()))
                                    .time(schedule.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                                    .build())
                            .collect(Collectors.toList());

                    // Get sessions count
                    long completedSessions = sessionRepository.countByClassEntityIdAndStatus(classEntity.getId(), ScheduleStatus.ACCEPTED);
                    long totalSessions = sessionRepository.countByClassEntityId(classEntity.getId());

                    return ClassTableItem.builder()
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
                })
                .collect(Collectors.toList());

        return new PageImpl<>(items, pageable, classPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ClassTableItem> getMyClassesAsStudent(UUID studentId, String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

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
                            .id(classEntity.getTutorId().toString())
                            .fullName(classEntity.getTutorName() != null ? classEntity.getTutorName() : "Tutor " + classEntity.getTutorId().toString().substring(0, 8))
                            .avatarUrl("")
                            .build());

                    // Get schedules
                    List<ClassSchedule> schedules = classEntity.getSchedules();
                    List<ScheduleInfo> scheduleInfos = schedules.stream()
                            .map(schedule -> ScheduleInfo.builder()
                                    .dayOfWeek(Integer.parseInt(schedule.getDayOfWeek()))
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
                        .dayOfWeek(DayOfWeek.of(scheduleReq.getDayOfWeek()).name())
                        .startTime(LocalTime.parse(scheduleReq.getTime()))
                        .durationMinutes(60)
                        .build())
                .collect(Collectors.toList());

        // Create class entity
        ClassEntity classEntity = ClassEntity.builder()
                .tutorId(tutorId)
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
                .tutorId(request.getTutorId())
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
                .studentId(request.getStudentId())
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
                    .tutorId(request.getTutorId())
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
}
package com.elearning.classservice.service.impl;

import com.elearning.classservice.dto.response.ClassDetailResponse;
import com.elearning.classservice.dto.response.SessionInfoResponse;
import com.elearning.classservice.dto.response.TutorClassResponse;
import com.elearning.classservice.dto.response.TutorStudentDetailResponse;
import com.elearning.classservice.dto.response.TutorStudentResponse;
import com.elearning.classservice.entity.*;
import com.elearning.classservice.entity.enums.AttendanceStatus;
import com.elearning.classservice.entity.enums.ClassType;
import com.elearning.classservice.entity.enums.EnrollmentStatus;
import com.elearning.classservice.entity.enums.ScheduleStatus;
import com.elearning.classservice.repository.*;
import com.elearning.classservice.service.TutorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TutorServiceImpl implements TutorService {
    
    private final ClassEnrollmentRepository classEnrollmentRepository;
    private final SessionParticipantRepository sessionParticipantRepository;
    private final ClassRepository classRepository;
    private final SessionRepository sessionRepository;
    private final ClassAnnouncementRepository classAnnouncementRepository;
    private final ClassAssignmentRepository classAssignmentRepository;
    
    @Override
    @Transactional(readOnly = true)
    public Page<TutorStudentResponse> getAllStudentsByTutorId(UUID tutorId, int page, int size) {
        log.info("Getting all students for tutor: {} with pagination page={}, size={}", tutorId, page, size);
        
        Map<UUID, TutorStudentResponse> studentMap = new HashMap<>();
        
        // 1. Lấy học sinh từ enrollments (ONE_ON_ONE và GROUP)
        List<ClassEnrollment> enrollments = classEnrollmentRepository.findByTutorId(tutorId);
        
        for (ClassEnrollment enrollment : enrollments) {
            UUID studentId = enrollment.getStudentId();
            ClassType classType = enrollment.getClassEntity().getClassType();
            
            // Determine student type based on class type
            TutorStudentResponse.StudentType studentType = classType == ClassType.ONE_ON_ONE 
                ? TutorStudentResponse.StudentType.ONE_ON_ONE 
                : TutorStudentResponse.StudentType.GROUP;
            
            // Nếu student chưa có trong map, hoặc có nhưng đang là TRIAL -> update
            if (!studentMap.containsKey(studentId) || 
                studentMap.get(studentId).getStudentType() == TutorStudentResponse.StudentType.TRIAL) {
                
                TutorStudentResponse response = TutorStudentResponse.builder()
                    .studentId(studentId)
                    .studentType(studentType)
                    .classId(enrollment.getClassEntity().getId())
                    .classTitle(enrollment.getClassEntity().getTitle())
                    .classType(classType)
                    .enrollmentStatus(enrollment.getStatus().name())
                    .paymentStatus(enrollment.getPaymentStatus() != null ? enrollment.getPaymentStatus().name() : null)
                    .enrolledAt(enrollment.getCreatedAt())
                    .build();
                
                studentMap.put(studentId, response);
            }
        }
        
        // 2. Lấy trial students từ session participants
        List<SessionParticipant> trialParticipants = sessionParticipantRepository.findTrialParticipantsByTutorId(tutorId);
        
        for (SessionParticipant participant : trialParticipants) {
            UUID studentId = participant.getStudentId();
            
            // Chỉ thêm trial student nếu họ chưa có trong map
            // (nghĩa là họ chưa enroll vào class chính thức nào)
            if (!studentMap.containsKey(studentId)) {
                TutorStudentResponse response = TutorStudentResponse.builder()
                    .studentId(studentId)
                    .studentType(TutorStudentResponse.StudentType.TRIAL)
                    .build();
                
                studentMap.put(studentId, response);
            }
        }
        
        // 3. Populate session history cho từng student
        for (TutorStudentResponse student : studentMap.values()) {
            // Lấy tất cả sessions của student
            List<SessionParticipant> allSessions = sessionParticipantRepository.findByStudentId(student.getStudentId());
            
            // Convert to SessionInfo DTO
            List<SessionInfoResponse> sessionInfoList = allSessions.stream()
                .map(sp -> SessionInfoResponse.builder()
                    .sessionId(sp.getSession().getId())
                    .startTime(sp.getSession().getStartTime())
                    .endTime(sp.getSession().getEndTime())
                    .status(sp.getSession().getStatus().name())
                    .isTrial(sp.getSession().getIsTrial())
                    .attendanceStatus(sp.getAttendanceStatus().name())
                    .build())
                .sorted(Comparator.comparing(SessionInfoResponse::getStartTime).reversed())
                .collect(Collectors.toList());
            
            student.setSessions(sessionInfoList);
            
            // Count attended sessions
            Long attendedCount = sessionParticipantRepository.countAttendedSessions(student.getStudentId());
            student.setTotalSessionsAttended(attendedCount != null ? attendedCount.intValue() : 0);
            
            // Total sessions
            student.setTotalSessionsScheduled(allSessions.size());
        }
        
        // Convert to list and sort
        List<TutorStudentResponse> allStudents = studentMap.values().stream()
            .sorted(Comparator.comparing(TutorStudentResponse::getStudentType)
                .thenComparing(s -> {
                    if (s.getEnrolledAt() != null) {
                        return s.getEnrolledAt();
                    } else if (s.getSessions() != null && !s.getSessions().isEmpty()) {
                        return s.getSessions().get(0).getStartTime();
                    } else {
                        return LocalDateTime.MIN;
                    }
                }, Comparator.nullsLast(Comparator.reverseOrder())))
            .collect(Collectors.toList());
        
        // Apply pagination using Spring Page
        int totalElements = allStudents.size();
        int startIndex = page * size;
        int endIndex = Math.min(startIndex + size, totalElements);
        
        List<TutorStudentResponse> paginatedStudents = (startIndex < totalElements) 
            ? allStudents.subList(startIndex, endIndex) 
            : new ArrayList<>();
        
        Pageable pageable = PageRequest.of(page, size);
        return new PageImpl<>(paginatedStudents, pageable, totalElements);
    }
    
    @Override
    @Transactional(readOnly = true)
    public TutorStudentDetailResponse getStudentDetail(UUID tutorId, UUID studentId) {
        log.info("Getting detailed info for student {} of tutor {}", studentId, tutorId);
        
        // Find enrollment for this student
        ClassEnrollment enrollment = classEnrollmentRepository.findByTutorIdAndStudentId(tutorId, studentId)
            .orElseThrow(() -> new RuntimeException("Student not found for this tutor"));
        
        // Get sessions for this student
        List<SessionParticipant> sessionParticipants = sessionParticipantRepository
            .findByStudentIdAndClassId(studentId, enrollment.getClassEntity().getId());
        
        // Calculate stats
        TutorStudentDetailResponse.StatsInfo stats = calculateStats(sessionParticipants);
        
        // Get class info
        TutorStudentDetailResponse.ClassInfo classInfo = buildClassInfo(enrollment.getClassEntity());
        
        // Build upcoming sessions
        List<TutorStudentDetailResponse.UpcomingSessionInfo> upcomingSessions = sessionParticipants.stream()
            .filter(sp -> sp.getSession().getStartTime().isAfter(LocalDateTime.now()))
            .sorted(Comparator.comparing((SessionParticipant sp) -> sp.getSession().getStartTime()))
            .limit(5)
            .map(this::mapToUpcomingSession)
            .collect(Collectors.toList());
        
        // Build session history
        List<TutorStudentDetailResponse.SessionHistoryInfo> sessionHistory = sessionParticipants.stream()
            .filter(sp -> sp.getSession().getStartTime().isBefore(LocalDateTime.now()))
            .sorted(Comparator.comparing((SessionParticipant sp) -> sp.getSession().getStartTime()).reversed())
            .limit(10)
            .map(this::mapToSessionHistory)
            .collect(Collectors.toList());
        
        // Determine enrollment types
        List<String> enrollmentTypes = new ArrayList<>();
        ClassType classType = enrollment.getClassEntity().getClassType();
        enrollmentTypes.add(classType == ClassType.ONE_ON_ONE ? "1-on-1" : "Group");
        
        // Determine status
        String status = enrollment.getStatus().name().equals("COMPLETED") || 
                       enrollment.getStatus().name().equals("CANCELLED") ? "Completed" : "Ongoing";
        
        return TutorStudentDetailResponse.builder()
            .studentId(studentId)
            .registeredDate(enrollment.getCreatedAt())
            .enrollmentTypes(enrollmentTypes)
            .status(status)
            .stats(stats)
            .classInfo(classInfo)
            .upcomingSessions(upcomingSessions)
            .sessionHistory(sessionHistory)
            .tutorNotes(enrollment.getNotes())
            .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<TutorClassResponse> getClasses(UUID tutorId, int page, int size) {
        log.info("Getting classes for tutor {} with pagination page={}, size={}", tutorId, page, size);
        
        // Get all classes for tutor
        List<ClassEntity> classes = classRepository.findByTutorId(tutorId);
        
        // Map to response
        List<TutorClassResponse> responses = classes.stream()
            .map(this::mapToTutorClassResponse)
            .collect(Collectors.toList());
        
        // Apply pagination
        Pageable pageable = PageRequest.of(page, size);
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), responses.size());
        
        List<TutorClassResponse> paginatedList = responses.subList(start, end);
        return new PageImpl<>(paginatedList, pageable, responses.size());
    }
    
    // Helper methods
    
    private TutorStudentDetailResponse.StatsInfo calculateStats(List<SessionParticipant> sessionParticipants) {
        int totalSessions = sessionParticipants.size();
        long completedSessions = sessionParticipants.stream()
            .filter(sp -> sp.getSession().getStatus() != null && 
                         sp.getSession().getStatus().name().equals("COMPLETED"))
            .count();
        
        long attendedSessions = sessionParticipants.stream()
            .filter(sp -> sp.getAttendanceStatus() != null && 
                         sp.getAttendanceStatus().name().equals("PRESENT"))
            .count();
        
        double completionRate = totalSessions > 0 ? (completedSessions * 100.0) / totalSessions : 0;
        double attendanceRate = totalSessions > 0 ? (attendedSessions * 100.0) / totalSessions : 0;
        
        Optional<LocalDateTime> lastSession = sessionParticipants.stream()
            .filter(sp -> sp.getSession().getStartTime().isBefore(LocalDateTime.now()))
            .map(sp -> sp.getSession().getStartTime())
            .max(LocalDateTime::compareTo);
        
        return TutorStudentDetailResponse.StatsInfo.builder()
            .sessionsCompleted((int) completedSessions)
            .totalSessions(totalSessions)
            .sessionsRemaining(totalSessions - (int) completedSessions)
            .completionRate(completionRate)
            .attendanceRate(attendanceRate)
            .lastSessionDate(lastSession.map(LocalDateTime::toLocalDate).orElse(null))
            .build();
    }
    
    private TutorStudentDetailResponse.ClassInfo buildClassInfo(ClassEntity classEntity) {
        String schedule = classEntity.getSchedules().isEmpty() ? "" : 
            classEntity.getSchedules().get(0).formatSchedule();
        
        return TutorStudentDetailResponse.ClassInfo.builder()
            .name(classEntity.getTitle())
            .instructor("You")
            .schedule(schedule)
            .build();
    }
    
    private TutorStudentDetailResponse.UpcomingSessionInfo mapToUpcomingSession(SessionParticipant sp) {
        return TutorStudentDetailResponse.UpcomingSessionInfo.builder()
            .id(sp.getSession().getId())
            .date(sp.getSession().getStartTime().toLocalDate())
            .time(sp.getSession().getStartTime().toLocalTime().toString())
            .duration(calculateDuration(sp.getSession().getStartTime(), sp.getSession().getEndTime()))
            .topic(sp.getSession().getTitle())
            .build();
    }
    
    private TutorStudentDetailResponse.SessionHistoryInfo mapToSessionHistory(SessionParticipant sp) {
        return TutorStudentDetailResponse.SessionHistoryInfo.builder()
            .id(sp.getSession().getId())
            .date(sp.getSession().getStartTime().toLocalDate())
            .duration(calculateDuration(sp.getSession().getStartTime(), sp.getSession().getEndTime()))
            .attendance(sp.getAttendanceStatus() != null ? sp.getAttendanceStatus().name() : "N/A")
            .topic(sp.getSession().getTitle())
            .build();
    }
    
    private TutorClassResponse mapToTutorClassResponse(ClassEntity classEntity) {
        // Get students from enrollments
        List<TutorClassResponse.StudentInfo> students = classEntity.getEnrollments().stream()
            .map(e -> TutorClassResponse.StudentInfo.builder()
                .id(e.getStudentId())
                .build())
            .collect(Collectors.toList());
        
        // Format schedules
        List<TutorClassResponse.ScheduleInfo> schedules = classEntity.getSchedules().stream()
            .flatMap(schedule -> {
                List<TutorClassResponse.ScheduleInfo> list = new ArrayList<>();
                String[] days = schedule.getDayOfWeek().split(",");
                for (String day : days) {
                    list.add(TutorClassResponse.ScheduleInfo.builder()
                        .day(capitalize(day.trim()))
                        .time(schedule.getStartTime().format(java.time.format.DateTimeFormatter.ofPattern("h:mm a")))
                        .build());
                }
                return list.stream();
            })
            .collect(Collectors.toList());
        
        // Calculate session stats
        int totalSessions = classEntity.getSessions().size();
        int completedSessions = (int) classEntity.getSessions().stream()
            .filter(s -> s.getStatus() != null && s.getStatus().name().equals("COMPLETED"))
            .count();
        
        // Map materials
        List<TutorClassResponse.MaterialInfo> materials = classEntity.getMaterials().stream()
            .map(m -> TutorClassResponse.MaterialInfo.builder()
                .id(m.getId())
                .name(m.getName())
                .type(m.getType())
                .date(m.getUploadDate())
                .build())
            .collect(Collectors.toList());
        
        return TutorClassResponse.builder()
            .id(classEntity.getId())
            .courseTitle(classEntity.getTitle())
            .students(students)
            .type(classEntity.getClassType() == ClassType.ONE_ON_ONE ? "1-on-1" : "Group")
            .status(classEntity.getStatus().name())
            .schedules(schedules)
            .startDate(classEntity.getCreatedAt().format(java.time.format.DateTimeFormatter.ofPattern("MMM d, yyyy")))
            .completedSessions(completedSessions)
            .totalSessions(totalSessions)
            .quizzes(new ArrayList<>()) // Empty for now
            .materials(materials)
            .build();
    }
    
    private String calculateDuration(LocalDateTime start, LocalDateTime end) {
        long minutes = java.time.Duration.between(start, end).toMinutes();
        return minutes + " min";
    }
    
    private String capitalize(String str) {
        if (str == null || str.isEmpty()) return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }

    @Override
    @Transactional(readOnly = true)
    public ClassDetailResponse getClassDetail(UUID tutorId, UUID classId) {
        log.info("Getting detail for class {} of tutor {}", classId, tutorId);
        
        ClassEntity classEntity = classRepository.findById(classId)
            .orElseThrow(() -> new RuntimeException("Class not found"));
            
        if (!classEntity.getTutorId().equals(tutorId)) {
            throw new RuntimeException("Class does not belong to tutor");
        }
        
        // Get students
        List<ClassDetailResponse.StudentInfo> students = classEntity.getEnrollments().stream()
            .map(e -> ClassDetailResponse.StudentInfo.builder()
                .id(e.getStudentId())
                .build()) // Name/Avatar will be populated by BFF
            .collect(Collectors.toList());
            
        // Get schedules
        List<ClassDetailResponse.ScheduleInfo> schedules = classEntity.getSchedules().stream()
            .flatMap(s -> {
                List<ClassDetailResponse.ScheduleInfo> list = new ArrayList<>();
                String[] days = s.getDayOfWeek().split(",");
                for (String day : days) {
                    list.add(ClassDetailResponse.ScheduleInfo.builder()
                        .day(capitalize(day.trim()))
                        .time(s.getStartTime().format(DateTimeFormatter.ofPattern("h:mm a")))
                        .build());
                }
                return list.stream();
            })
            .collect(Collectors.toList());
            
        // Get materials
        List<ClassDetailResponse.MaterialInfo> materials = classEntity.getMaterials().stream()
            .map(m -> ClassDetailResponse.MaterialInfo.builder()
                .id(m.getId())
                .name(m.getName())
                .type(m.getType())
                .date(m.getUploadDate())
                .build())
            .collect(Collectors.toList());
            
        // Get announcements
        List<ClassDetailResponse.AnnouncementInfo> announcements = classAnnouncementRepository.findByClassEntityIdOrderByDateDesc(classId).stream()
            .map(a -> ClassDetailResponse.AnnouncementInfo.builder()
                .id(a.getId())
                .title(a.getTitle())
                .content(a.getContent())
                .date(a.getDate())
                .author(a.getAuthor())
                .build())
            .collect(Collectors.toList());
            
        // Get assignments
        List<ClassDetailResponse.AssignmentInfo> assignments = classAssignmentRepository.findByClassEntityIdOrderByDueDateAsc(classId).stream()
            .map(a -> ClassDetailResponse.AssignmentInfo.builder()
                .id(a.getId())
                .title(a.getTitle())
                .description(a.getDescription())
                .dueDate(a.getDueDate())
                .submissions(a.getSubmissionsCount())
                .build())
            .collect(Collectors.toList());
            
        // Get sessions
        List<Session> sessions = sessionRepository.findByClassEntityIdOrderByStartTimeAsc(classId);
        List<ClassDetailResponse.SessionDetailInfo> sessionDetails = sessions.stream()
            .map(s -> {
                List<ClassDetailResponse.AttendanceInfo> attendance = sessionParticipantRepository.findBySessionId(s.getId()).stream()
                    .map(p -> ClassDetailResponse.AttendanceInfo.builder()
                        .studentId(p.getStudentId())
                        .status(p.getAttendanceStatus().name())
                        .build())
                    .collect(Collectors.toList());
                    
                return ClassDetailResponse.SessionDetailInfo.builder()
                    .id(s.getId())
                    .date(s.getStartTime().toLocalDate())
                    .time(s.getStartTime().format(DateTimeFormatter.ofPattern("h:mm a")))
                    .duration(calculateDuration(s.getStartTime(), s.getEndTime()))
                    .topic(s.getTitle())
                    .attendance(attendance)
                    .materials(new ArrayList<>())
                    .build();
            })
            .collect(Collectors.toList());
            
        // Calculate stats
        int totalStudents = students.size();
        int activeStudents = (int) classEntity.getEnrollments().stream()
            .filter(e -> e.getStatus() == EnrollmentStatus.BOOKED)
            .count();
        int totalSessions = sessions.size();
        int completedSessions = (int) sessions.stream()
            .filter(s -> s.getStatus() == ScheduleStatus.BOOKED && s.getEndTime().isBefore(LocalDateTime.now()))
            .count();
            
        // Calculate average attendance
        double averageAttendance = 0.0;
        if (completedSessions > 0) {
            long totalPresent = sessions.stream()
                .filter(s -> s.getStatus() == ScheduleStatus.BOOKED && s.getEndTime().isBefore(LocalDateTime.now()))
                .flatMap(s -> sessionParticipantRepository.findBySessionId(s.getId()).stream())
                .filter(p -> p.getAttendanceStatus() == AttendanceStatus.PRESENT)
                .count();
            
            if (totalStudents > 0) {
                averageAttendance = (double) totalPresent / (completedSessions * totalStudents) * 100;
            }
        }
        
        ClassDetailResponse.StatsInfo stats = ClassDetailResponse.StatsInfo.builder()
            .totalStudents(totalStudents)
            .activeStudents(activeStudents)
            .completedSessions(completedSessions)
            .totalSessions(totalSessions)
            .averageAttendance(Math.round(averageAttendance * 10.0) / 10.0)
            .averageProgress(0.0)
            .build();
            
        return ClassDetailResponse.builder()
            .id(classEntity.getId())
            .courseTitle(classEntity.getTitle())
            .students(students)
            .type(classEntity.getClassType() == ClassType.ONE_ON_ONE ? "1-on-1" : "Group")
            .status(classEntity.getStatus().name())
            .schedules(schedules)
            .startDate(classEntity.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM d, yyyy")))
            .completedSessions(completedSessions)
            .totalSessions(totalSessions)
            .quizzes(new ArrayList<>())
            .materials(materials)
            .stats(stats)
            .sessions(sessionDetails)
            .announcements(announcements)
            .assignments(assignments)
            .build();
    }
}

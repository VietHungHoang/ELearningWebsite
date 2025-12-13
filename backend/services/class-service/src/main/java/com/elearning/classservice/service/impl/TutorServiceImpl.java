package com.elearning.classservice.service.impl;

import com.elearning.classservice.dto.response.ClassDetailResponse;
import com.elearning.classservice.dto.response.SessionInfoResponse;
import com.elearning.classservice.dto.response.TutorClassResponse;
import com.elearning.classservice.dto.response.TutorStudentDetailResponse;
import com.elearning.classservice.dto.response.TutorStudentResponse;
import com.elearning.classservice.dto.response.TutorStatsResponse;
import com.elearning.classservice.dto.response.GroupClassResponse;
import com.elearning.classservice.entity.*;
import com.elearning.classservice.entity.enums.*;
import com.elearning.classservice.repository.*;
import com.elearning.classservice.service.TutorService;
import com.elearning.classservice.mapper.GroupClassMapper;
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
    private final TrialSessionRepository trialSessionRepository;
    private final GroupClassMapper groupClassMapper;
    
    @Override
    @Transactional(readOnly = true)
    public Page<TutorStudentResponse> getAllStudentsByTutorId(UUID tutorId, int page, int size) {
        return null;
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
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TutorStatsResponse> getTutorStats(List<UUID> tutorIds, UUID studentId) {
        log.info("Getting stats for tutors: {}", tutorIds);

        List<TutorStatsResponse> results = new ArrayList<>();

        for (UUID tutorId : tutorIds) {
            // Count booked sessions (all sessions where tutor participated)
            int bookedSessionsCount = (int) sessionRepository.countByTutorId(tutorId);

            // Count unique students for this tutor (all students enrolled in tutor's classes)
            List<ClassEnrollment> enrollments = classEnrollmentRepository.findByTutorId(tutorId);
            Set<UUID> uniqueStudents = enrollments.stream()
                .map(ClassEnrollment::getStudentId)
                .collect(Collectors.toSet());
            int studentCount = uniqueStudents.size();

            // Check if tutor has trial session with the specified student
            boolean hasTrialSession = studentId != null ?
             !trialSessionRepository.existsByTutorIdAndStudentId(tutorId, studentId)
             : true;


            TutorStatsResponse stats = TutorStatsResponse.builder()
                    .tutorId(tutorId)
                    .bookedSessionsCount(bookedSessionsCount)
                    .studentCount(studentCount)
                    .hasTrialSession(hasTrialSession)
                    .build();

            log.info("Tutor {}: bookedSessionsCount={}, studentCount={}, hasTrialSession={}",
                    tutorId, bookedSessionsCount, studentCount, hasTrialSession);

            results.add(stats);
        }

        log.info("Retrieved stats for {} tutors", results.size());
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public List<GroupClassResponse> getGroupClasses(UUID tutorId) {
        // Lấy tất cả group classes (classes có maxStudents > 1) của tutor
        List<ClassEntity> groupClassEntities = classRepository.findByTutorIdAndMaxStudentsGreaterThan(tutorId, 1);

        return groupClassEntities.stream()
                .map(groupClassMapper::mapToGroupClassResponse)
                .collect(Collectors.toList());
    }
}

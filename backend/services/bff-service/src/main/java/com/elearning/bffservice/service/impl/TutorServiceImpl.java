package com.elearning.bffservice.service.impl;

import com.elearning.bffservice.client.ClassServiceClient;
import com.elearning.bffservice.client.StudentServiceClient;
import com.elearning.bffservice.client.TutorServiceClient;
import com.elearning.bffservice.dto.classes.response.GroupClassResponse;
import com.elearning.bffservice.dto.request.BulkUpdateAvailabilityRequest;
import com.elearning.bffservice.dto.request.UpdateOnboardingRequest;
import com.elearning.bffservice.dto.tutor.request.GetTutorStudentsRequest;
import com.elearning.bffservice.dto.tutor.response.AvailabilityListResponse;
import com.elearning.bffservice.dto.tutor.response.TutorDashboardChartsResponse;
import com.elearning.bffservice.bff.tutors.response.TutorDetailBffResponse;
import com.elearning.bffservice.dto.ApiResponse;
import com.elearning.bffservice.dto.response.ClassResponse;
import com.elearning.bffservice.dto.response.StudentDetailResponse;
import com.elearning.bffservice.dto.student.response.StudentResponse;
import com.elearning.bffservice.dto.tutor.response.TutorDetailResponse;
import com.elearning.bffservice.dto.response.OnboardingResponse;
import com.elearning.bffservice.dto.response.TutorProfileResponse;
import com.elearning.bffservice.dto.response.TutorStudentResponse;
import com.elearning.bffservice.dto.response.TutorStudentDetailResponse;
import com.elearning.bffservice.dto.response.TutorClassResponse;
import com.elearning.bffservice.dto.response.UserInfoResponse;
import com.elearning.bffservice.mapper.TutorMapper;
import com.elearning.bffservice.service.TutorService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TutorServiceImpl implements TutorService {

    private final TutorServiceClient tutorServiceClient;
    private final ClassServiceClient classServiceClient;
    private final StudentServiceClient studentServiceClient;
    private final TutorMapper tutorMapper;

    @Override
    public TutorDetailBffResponse getTutorDetail(UUID tutorId, UUID studentId) {
        log.info("Getting detailed tutor information for tutor: {}, student: {}", tutorId, studentId);

        ApiResponse<TutorDetailResponse> tutorDetailResponse = tutorServiceClient.getTutorDetail(tutorId);
        TutorDetailResponse tutorDetail = tutorDetailResponse.getData();

        List<GroupClassResponse> groupClasses = classServiceClient.getGroupClasses(tutorId).getData();
        TutorDetailBffResponse result = tutorMapper.mapToTutorDetailBffResponse(tutorDetail, groupClasses);

        log.info("Successfully mapped tutor detail with {} group classes",
                groupClasses != null ? groupClasses.size() : 0);
        return result;
    }

    @Override
    public Page<StudentResponse> getTutorStudents(UUID tutorId, GetTutorStudentsRequest request) {

        Page<TutorStudentResponse> classServiceData = classServiceClient.getTutorStudents(tutorId, 0,
                Integer.MAX_VALUE);

        List<UUID> studentIds = classServiceData.getContent().stream()
                .map(TutorStudentResponse::getStudentId)
                .distinct()
                .toList();

        if (studentIds.isEmpty()) {
            return new PageImpl<>(new ArrayList<>(), PageRequest.of(request.getPage(), request.getSize()), 0);
        }

        List<StudentResponse> allStudents = classServiceData.getContent().stream()
                .map(classStudent -> {
//                    UserInfoResponse userInfo = userInfoMap.get(classStudent.getStudentId());
                    UserInfoResponse userInfo = null;

                    List<String> enrollmentTypes = new ArrayList<>();
                    if (classStudent.getStudentType() != null) {
                        switch (classStudent.getStudentType()) {
                            case ONE_ON_ONE -> enrollmentTypes.add("1-on-1");
                            case GROUP -> enrollmentTypes.add("Group");
                            case TRIAL -> enrollmentTypes.add("Trial");
                        }
                    }

                    String studentStatus = determineStudentStatus(classStudent);

                    return StudentResponse.builder()
                            .id(classStudent.getStudentId())
                            .fullName(userInfo != null ? userInfo.getName() : null)
                            .email(userInfo != null ? userInfo.getEmail() : null)
                            .avatarUrl(userInfo != null ? userInfo.getAvatarUrl() : null)
                            .registeredDate(classStudent.getEnrolledAt())
                            .enrollmentTypes(enrollmentTypes)
                            .status(studentStatus)
                            .build();
                })
                .toList();

        List<StudentResponse> filteredStudents = allStudents.stream()
                .filter(student -> {
                    if (request.getStatus() != null && !request.getStatus().isBlank()) {
                        if (!request.getStatus().equalsIgnoreCase(student.getStatus())) {
                            return false;
                        }
                    }

                    if (request.getEnrollmentType() != null && !request.getEnrollmentType().isBlank()) {
                        boolean matchesType = student.getEnrollmentTypes().stream()
                                .anyMatch(type -> type.equalsIgnoreCase(request.getEnrollmentType()));
                        if (!matchesType) {
                            return false;
                        }
                    }

                    if (request.getSearch() != null && !request.getSearch().isBlank()) {
                        String lowerSearch = request.getSearch().toLowerCase();
                        return (student.getFullName() != null && student.getFullName().toLowerCase().contains(lowerSearch)) ||
                                (student.getEmail() != null && student.getEmail().toLowerCase().contains(lowerSearch));
                    }

                    return true;
                })
                .collect(Collectors.toList());

        int totalElements = filteredStudents.size();
        int startIndex = request.getPage() * request.getSize();
        int endIndex = Math.min(startIndex + request.getSize(), totalElements);

        List<StudentResponse> paginatedStudents = (startIndex < totalElements)
                ? filteredStudents.subList(startIndex, endIndex)
                : new ArrayList<>();

        Pageable pageable = PageRequest.of(request.getPage(), request.getSize());
        return new PageImpl<>(paginatedStudents, pageable, totalElements);
    }

    @Override
    public StudentDetailResponse getStudentDetail(UUID tutorId, UUID studentId) {
        log.info("BFF: Getting detail for student {} of tutor {}", studentId, tutorId);

        return null;

        // Get data from Class Service
//        ApiResponse<TutorStudentDetailResponse> classDataResponse = classServiceClient.getStudentDetail(tutorId, studentId);
//        TutorStudentDetailResponse classData = classDataResponse.getData();

        // Get user info
//        UserInfoResponse userInfo = userServiceClient.getListUsersByIds(List.of(studentId)).get(studentId);
//        UserInfoResponse userInfo = null;

        // Get student profile from Student Service
//        ApiResponse<StudentProfileResponse> studentProfileResponse = studentServiceClient.getStudentDetailById(studentId);
//        StudentProfileResponse studentProfile = studentProfileResponse.getData();
//
//        // Parse strengths and weaknesses
//        List<String> strengths = parseListField(studentProfile.getStrengths());
//        List<String> weaknesses = parseListField(studentProfile.getWeaknesses());
//
//        return StudentDetailResponse.builder()
//                .id(studentId)
//                .name(userInfo != null ? userInfo.getName() : null)
//                .avatarUrl(userInfo != null ? userInfo.getAvatarUrl() : null)
//                .registeredDate(classData.getRegisteredDate())
//                .email(userInfo != null ? userInfo.getEmail() : null)
//                .enrollmentTypes(classData.getEnrollmentTypes())
//                .status(classData.getStatus())
//                .stats(mapStats(classData.getStats()))
//                .contact(StudentDetailResponse.ContactInfo.builder()
//                        .phone(studentProfile.getPhone())
//                        .joinedDate(classData.getRegisteredDate())
//                        .build())
//                .classInfo(mapClassInfo(classData.getClassInfo()))
//                .upcomingSessions(mapUpcomingSessions(classData.getUpcomingSessions()))
//                .sessionHistory(mapSessionHistory(classData.getSessionHistory()))
//                .strengths(strengths)
//                .weaknesses(weaknesses)
//                .tutorNotes(classData.getTutorNotes())
//                .build();
    }

    @Override
    public Page<ClassResponse> getClasses(UUID tutorId, int page, int limit) {
        log.info("BFF: Getting classes for tutor {} with pagination page={}, limit={}", tutorId, page, limit);

        // Get classes from Class Service
        Page<TutorClassResponse> classData = classServiceClient.getClasses(tutorId, page, limit);

        // Extract all unique student IDs
        Set<UUID> allStudentIds = classData.getContent().stream()
                .flatMap(c -> c.getStudents().stream().map(TutorClassResponse.StudentInfo::getId))
                .collect(Collectors.toSet());

        // Batch get user info if there are students
//        Map<UUID, UserInfoResponse> userInfoMap = allStudentIds.isEmpty()
//                ? new HashMap<>()
//                : userServiceClient.getListUsersByIds(new ArrayList<>(allStudentIds));
        Map<UUID, UserInfoResponse> userInfoMap = new HashMap<>();

        // Map to ClassResponse
        List<ClassResponse> classResponses = classData.getContent().stream()
                .map(classItem -> {
                    // Map students with user info
                    List<ClassResponse.StudentInfo> students = classItem.getStudents().stream()
                            .map(s -> {
                                UserInfoResponse userInfo = userInfoMap.get(s.getId());
                                return ClassResponse.StudentInfo.builder()
                                        .id(s.getId())
                                        .name(userInfo != null ? userInfo.getName() : null)
                                        .avatar(userInfo != null ? userInfo.getAvatarUrl() : null)
                                        .build();
                            })
                            .collect(Collectors.toList());

                    return ClassResponse.builder()
                            .id(classItem.getId())
                            .courseTitle(classItem.getCourseTitle())
                            .students(students)
                            .type(classItem.getType())
                            .status(classItem.getStatus())
                            .schedules(mapSchedules(classItem.getSchedules()))
                            .startDate(classItem.getStartDate())
                            .completedSessions(classItem.getCompletedSessions())
                            .totalSessions(classItem.getTotalSessions())
                            .quizzes(new ArrayList<>()) // Empty for now
                            .materials(mapMaterials(classItem.getMaterials()))
                            .build();
                })
                .collect(Collectors.toList());

        Pageable pageable = PageRequest.of(page, limit);
        return new PageImpl<>(classResponses, pageable, classData.getTotalElements());
    }

    private String determineStudentStatus(TutorStudentResponse classStudent) {
        String enrollmentStatus = classStudent.getEnrollmentStatus();
        if (enrollmentStatus != null) {
            if (enrollmentStatus.equals("COMPLETED") || enrollmentStatus.equals("CANCELLED")) {
                return "Completed";
            }
        }

        if (classStudent.getSessions() != null && !classStudent.getSessions().isEmpty()) {
            boolean allSessionsCompleted = classStudent.getSessions().stream()
                    .allMatch(session -> {
                        String sessionStatus = session.getStatus();
                        return sessionStatus != null &&
                                (sessionStatus.equalsIgnoreCase("COMPLETED") ||
                                        sessionStatus.equalsIgnoreCase("CANCELLED"));
                    });

            if (allSessionsCompleted) {
                return "Completed";
            }
        }

        return "Ongoing";
    }

    private List<String> parseListField(List<String> field) {
        return field != null ? field : new ArrayList<>();
    }

    private StudentDetailResponse.StatsInfo mapStats(TutorStudentDetailResponse.StatsInfo stats) {
        if (stats == null)
            return null;
        return StudentDetailResponse.StatsInfo.builder()
                .sessionsCompleted(stats.getSessionsCompleted())
                .totalSessions(stats.getTotalSessions())
                .sessionsRemaining(stats.getSessionsRemaining())
                .completionRate(stats.getCompletionRate())
                .attendanceRate(stats.getAttendanceRate())
                .lastSessionDate(stats.getLastSessionDate())
                .build();
    }

    private StudentDetailResponse.ClassInfo mapClassInfo(TutorStudentDetailResponse.ClassInfo classInfo) {
        if (classInfo == null)
            return null;
        return StudentDetailResponse.ClassInfo.builder()
                .name(classInfo.getName())
                .instructor(classInfo.getInstructor())
                .schedule(classInfo.getSchedule())
                .build();
    }

    private List<StudentDetailResponse.UpcomingSessionInfo> mapUpcomingSessions(
            List<TutorStudentDetailResponse.UpcomingSessionInfo> sessions) {
        if (sessions == null)
            return new ArrayList<>();
        return sessions.stream()
                .map(s -> StudentDetailResponse.UpcomingSessionInfo.builder()
                        .id(s.getId())
                        .date(s.getDate())
                        .time(s.getTime())
                        .duration(s.getDuration())
                        .topic(s.getTopic())
                        .build())
                .collect(Collectors.toList());
    }

    private List<StudentDetailResponse.SessionHistoryInfo> mapSessionHistory(
            List<TutorStudentDetailResponse.SessionHistoryInfo> sessions) {
        if (sessions == null)
            return new ArrayList<>();
        return sessions.stream()
                .map(s -> StudentDetailResponse.SessionHistoryInfo.builder()
                        .id(s.getId())
                        .date(s.getDate())
                        .duration(s.getDuration())
                        .attendance(s.getAttendance())
                        .topic(s.getTopic())
                        .build())
                .collect(Collectors.toList());
    }

    private List<ClassResponse.ScheduleInfo> mapSchedules(List<TutorClassResponse.ScheduleInfo> schedules) {
        if (schedules == null)
            return new ArrayList<>();
        return schedules.stream()
                .map(s -> ClassResponse.ScheduleInfo.builder()
                        .day(s.getDay())
                        .time(s.getTime())
                        .build())
                .collect(Collectors.toList());
    }

    private List<ClassResponse.MaterialInfo> mapMaterials(List<TutorClassResponse.MaterialInfo> materials) {
        if (materials == null)
            return new ArrayList<>();
        return materials.stream()
                .map(m -> ClassResponse.MaterialInfo.builder()
                        .id(m.getId())
                        .name(m.getName())
                        .type(m.getType())
                        .date(m.getDate())
                        .build())
                .collect(Collectors.toList());
    }

    public TutorProfileResponse getTutorProfile(UUID tutorId) {
        log.info("BFF: Getting tutor profile for tutorId: {}", tutorId);

        // Get tutor data from tutor service
        return null;
        // if (tutorData == null) {
        //     log.warn("Tutor data not found for tutorId: {}", tutorId);
        //     return null;
        // }

        // // Get user data from user service
        // UserInfoResponse userData = userServiceClient.getUserById(tutorId);
        // if (userData == null) {
        //     log.warn("User data not found for tutorId: {}", tutorId);
        //     return null;
        // }

        // // Get subjects from common service
        // List<SubjectResponse> allSubjects = commonServiceClient.getAllSubjects();
        // Map<UUID, SubjectResponse> subjectMap = allSubjects.stream()
        //         .collect(Collectors.toMap(SubjectResponse::getId, subject -> subject));

        //         return null;
        // Build the response
        // return TutorProfileResponse.builder()
        //         .fullName(userData.getName())
        //         .email(userData.getEmail())
        //         .phone(userData.getPhone())
        //         .gender(userData.getGender())
        //         .city(userData.getCity())
        //         .headline(tutorData.getSpecialization())
        //         .subjects(tutorData.getSubjects() != null ? tutorData.getSubjects().stream()
        //                 .filter(subject -> subject.getSubjectId() != null
        //                         && subjectMap.containsKey(subject.getSubjectId()))
        //                 .map(subject -> TutorProfileResponse.Subject.builder()
        //                         .id(subjectMap.get(subject.getSubjectId()).getId().toString())
        //                         .name(subjectMap.get(subject.getSubjectId()).getName())
        //                         .build())
        //                 .collect(Collectors.toList()) : null)
        //         .introduction(tutorData.getIntroduction())
        //         .avatarUrl(userData.getAvatarUrl())
        //         .introductionVideoUrl(tutorData.getVideoUrl())
        //         .socialLinks(tutorData.getSocialLinks() != null ? tutorData.getSocialLinks().stream()
        //                 .map(social -> TutorProfileResponse.SocialLink.builder()
        //                         .id(social.getId().toString())
        //                         .platform(social.getPlatform())
        //                         .url(social.getUrl())
        //                         .build())
        //                 .collect(Collectors.toList()) : null)
        //         .education(tutorData.getCareerEntries() != null ? tutorData.getCareerEntries().stream()
        //                 .filter(entry -> "EDUCATION".equals(entry.getType()))
        //                 .map(entry -> TutorProfileResponse.CareerEntry.builder()
        //                         .id(entry.getId().toString())
        //                         .title(entry.getTitle())
        //                         .institution(entry.getInstitution())
        //                         .startDate(entry.getStartDate() != null ? entry.getStartDate().toString() : null)
        //                         .endDate(entry.getEndDate() != null ? entry.getEndDate().toString() : null)
        //                         .location(entry.getLocation())
        //                         .description(entry.getDescription())
        //                         .build())
        //                 .collect(Collectors.toList()) : null)
        //         .experience(tutorData.getCareerEntries() != null ? tutorData.getCareerEntries().stream()
        //                 .filter(entry -> "EXPERIENCE".equals(entry.getType()))
        //                 .map(entry -> TutorProfileResponse.CareerEntry.builder()
        //                         .id(entry.getId().toString())
        //                         .title(entry.getTitle())
        //                         .institution(entry.getInstitution())
        //                         .startDate(entry.getStartDate() != null ? entry.getStartDate().toString() : null)
        //                         .endDate(entry.getEndDate() != null ? entry.getEndDate().toString() : null)
        //                         .location(entry.getLocation())
        //                         .description(entry.getDescription())
        //                         .build())
        //                 .collect(Collectors.toList()) : null)
        //         .certifications(tutorData.getCertifications() != null ? tutorData.getCertifications().stream()
        //                 .map(cert -> TutorProfileResponse.Certification.builder()
        //                         .id(cert.getId().toString())
        //                         .name(cert.getName())
        //                         .issuingOrganization(cert.getIssuingOrganization())
        //                         .issueDate(cert.getIssueDate() != null ? cert.getIssueDate().toString() : null)
        //                         .expirationDate(
        //                                 cert.getExpirationDate() != null ? cert.getExpirationDate().toString() : null)
        //                         .credentialId(cert.getCredentialId())
        //                         .credentialUrl(cert.getCredentialUrl())
        //                         .build())
        //                 .collect(Collectors.toList()) : null)
        //         .build();
    }

    @Override
    public AvailabilityListResponse getAvailabilities(UUID tutorId, LocalDate startDate, LocalDate endDate) {
        log.info("BFF: Getting availabilities for tutor {} from {} to {}", tutorId, startDate, endDate);

        // Simply proxy to tutor-service
        ApiResponse<AvailabilityListResponse> response = tutorServiceClient.getAvailabilities(tutorId, startDate, endDate);

        log.info("BFF: Retrieved {} availability patterns", response.getData() != null && response.getData().getAvailabilities() != null ? response.getData().getAvailabilities().size() : 0);
        return response.getData();
    }

    @Override
    public void bulkUpdateAvailability(UUID tutorId, BulkUpdateAvailabilityRequest request) {
        log.info("BFF: Bulk updating availability for tutor {} with mode: {}", tutorId, request.getMode());

        // Simply proxy to tutor-service
        tutorServiceClient.bulkUpdateAvailability(tutorId, request);

        log.info("BFF: Successfully bulk updated availability for tutor {}", tutorId);
    }

    @Override
    public OnboardingResponse getOnboarding(UUID tutorId) {
        log.info("BFF: Getting onboarding for tutor {}", tutorId);

        ApiResponse<OnboardingResponse> response = tutorServiceClient.getOnboarding(tutorId);

        log.info("BFF: Retrieved onboarding for tutor {}", tutorId);
        return response.getData();
    }

    @Override
    public void updateOnboarding(UUID tutorId, UpdateOnboardingRequest request) {
        log.info("BFF: Updating onboarding for tutor {}", tutorId);

        tutorServiceClient.updateOnboarding(tutorId, request);

        log.info("BFF: Successfully updated onboarding for tutor {}", tutorId);
    }

    @Override
    public TutorDashboardChartsResponse getDashboardCharts(UUID tutorId) {
        log.info("BFF: Getting dashboard charts for tutor {}", tutorId);

        var studentsResponse = classServiceClient.getMonthlyStudentStats(tutorId);
        var incomesResponse = tutorServiceClient.getMonthlyIncomeStats(tutorId);

        TutorDashboardChartsResponse response = TutorDashboardChartsResponse.builder()
                .students(studentsResponse != null ? studentsResponse.getData() : null)
                .incomes(incomesResponse != null ? incomesResponse.getData() : null)
                .build();

        log.info("BFF: Successfully retrieved dashboard charts for tutor {}", tutorId);
        return response;
    }
}


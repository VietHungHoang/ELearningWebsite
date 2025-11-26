package com.elearning.bffservice.service.impl;

import com.elearning.bffservice.client.ClassServiceClient;
import com.elearning.bffservice.client.CommonServiceClient;
import com.elearning.bffservice.client.SearchServiceClient;
import com.elearning.bffservice.client.StudentServiceClient;
import com.elearning.bffservice.client.TutorServiceClient;
import com.elearning.bffservice.client.UserServiceClient;
import com.elearning.bffservice.dto.request.BulkUpdateAvailabilityRequest;
import com.elearning.bffservice.dto.request.SearchTutorRequest;
import com.elearning.bffservice.dto.response.AvailabilityResponse;
import com.elearning.bffservice.dto.response.BookedSessionResponse;
import com.elearning.bffservice.dto.response.ClassResponse;
import com.elearning.bffservice.dto.response.ClassServiceBookedSessionResponse;
import com.elearning.bffservice.dto.response.StudentDetailResponse;
import com.elearning.bffservice.dto.response.StudentResponse;
import com.elearning.bffservice.dto.response.TutorSearchResponse;
import com.elearning.bffservice.dto.response.TutorSearchResult;
import com.elearning.bffservice.dto.response.TutorProfileResponse;
import com.elearning.bffservice.dto.response.TutorStudentResponse;
import com.elearning.bffservice.dto.response.TutorStudentDetailResponse;
import com.elearning.bffservice.dto.response.TutorClassResponse;
import com.elearning.bffservice.dto.response.UserInfoResponse;
import com.elearning.bffservice.dto.response.StudentProfileResponse;
import com.elearning.bffservice.dto.response.CountryResponse;
import com.elearning.bffservice.dto.response.LanguageResponse;
import com.elearning.bffservice.dto.response.SubjectResponse;
import com.elearning.bffservice.dto.response.enums.ScheduleStatus;
import com.elearning.bffservice.service.TutorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TutorServiceImpl implements TutorService {

    private final TutorServiceClient tutorServiceClient;
    private final SearchServiceClient searchServiceClient;
    private final CommonServiceClient commonServiceClient;
    private final ClassServiceClient classServiceClient;
    private final UserServiceClient userServiceClient;
    private final StudentServiceClient studentServiceClient;

    @Override
    public Page<TutorSearchResponse> searchTutors(List<String> languageCodes, BigDecimal minPrice, BigDecimal maxPrice, UUID categoryId, boolean categoryIsParent, List<String> availableDays, int page, int size) {
        log.info("BFF: Searching tutors - languages: {}, price: {}-{}, categoryId: {}, isParent: {}", 
                languageCodes, minPrice, maxPrice, categoryId, categoryIsParent);
        
        // 1. Resolve category IDs if needed
        List<UUID> categoryIdsToSearch = null;
        if (categoryId != null) {
            if (categoryIsParent) {
                var categories = commonServiceClient.getAllCategories();
                categoryIdsToSearch = categories.stream()
                        .filter(c -> categoryId.equals(c.getParentId()))
                        .map(c -> c.getId())
                        .toList();
                log.debug("Resolved parent category {} to child categories: {}", categoryId, categoryIdsToSearch);
            } else {
                categoryIdsToSearch = List.of(categoryId);
            }
        }

        // 2. Build search request for Search Service
        SearchTutorRequest searchRequest = SearchTutorRequest.builder()
                .languageCodes(languageCodes)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .categoryIds(categoryIdsToSearch)
                .availableDays(availableDays)
                .page(page)
                .size(size)
                .build();

        // 3. Call Search Service to get tutor IDs with scores
        Page<TutorSearchResult> searchResults = searchServiceClient.searchTutors(searchRequest);
        
        log.info("Search Service returned {} results", searchResults.getTotalElements());
        
        if (searchResults.isEmpty()) {
            return new PageImpl<>(List.of(), PageRequest.of(page, size), 0);
        }

        // 4. Extract tutor IDs in order
        List<UUID> tutorIds = searchResults.getContent().stream()
                .map(TutorSearchResult::getTutorId)
                .toList();

        // 5. Fetch full tutor data from Tutor Service
        List<TutorSearchResponse> tutorDetails = tutorServiceClient.getTutorsByIds(tutorIds);
        
        // 6. Create map for quick lookup
        Map<UUID, TutorSearchResponse> tutorMap = tutorDetails.stream()
                .collect(Collectors.toMap(
                        t -> t.getId() != null ? t.getId() : UUID.randomUUID(), 
                        t -> t
                ));

        // 7. Reorder results according to search ranking (preserve order)
        List<TutorSearchResponse> orderedResults = tutorIds.stream()
                .map(tutorMap::get)
                .filter(Objects::nonNull)
                .toList();

        log.info("Enriched {} tutors with details from Tutor Service", orderedResults.size());

        // 8. Return paginated results
        return new PageImpl<>(
                orderedResults,
                PageRequest.of(page, size),
                searchResults.getTotalElements()
        );
    }

    @Override
    public Page<StudentResponse> getTutorStudents(UUID tutorId, int page, int limit, String status, String enrollmentType, String search) {
        log.info("BFF: Getting students for tutor {} with filters - status: {}, enrollmentType: {}, search: {}",
                 tutorId, status, enrollmentType, search);

        Page<TutorStudentResponse> classServiceData = classServiceClient.getTutorStudents(tutorId, 0, Integer.MAX_VALUE);

        List<UUID> studentIds = classServiceData.getContent().stream()
            .map(TutorStudentResponse::getStudentId)
            .distinct()
            .collect(Collectors.toList());

        if (studentIds.isEmpty()) {
            return new PageImpl<>(new ArrayList<>(), PageRequest.of(page, limit), 0);
        }

        Map<UUID, UserInfoResponse> userInfoMap = userServiceClient.batchGetUsers(studentIds);

        List<StudentResponse> allStudents = classServiceData.getContent().stream()
            .map(classStudent -> {
                UserInfoResponse userInfo = userInfoMap.get(classStudent.getStudentId());

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
                    .name(userInfo != null ? userInfo.getName() : null)
                    .email(userInfo != null ? userInfo.getEmail() : null)
                    .avatarUrl(userInfo != null ? userInfo.getAvatarUrl() : null)
                    .registeredDate(classStudent.getEnrolledAt())
                    .enrollmentTypes(enrollmentTypes)
                    .status(studentStatus)
                    .build();
            })
            .collect(Collectors.toList());

        List<StudentResponse> filteredStudents = allStudents.stream()
            .filter(student -> {
                if (status != null && !status.isBlank()) {
                    if (!status.equalsIgnoreCase(student.getStatus())) {
                        return false;
                    }
                }
                
                if (enrollmentType != null && !enrollmentType.isBlank()) {
                    boolean matchesType = student.getEnrollmentTypes().stream()
                        .anyMatch(type -> type.equalsIgnoreCase(enrollmentType));
                    if (!matchesType) {
                        return false;
                    }
                }
                
                if (search != null && !search.isBlank()) {
                    String lowerSearch = search.toLowerCase();
                    boolean matchesSearch =
                        (student.getName() != null && student.getName().toLowerCase().contains(lowerSearch)) ||
                        (student.getEmail() != null && student.getEmail().toLowerCase().contains(lowerSearch));
                    if (!matchesSearch) {
                        return false;
                    }
                }
                
                return true;
            })
            .collect(Collectors.toList());

        int totalElements = filteredStudents.size();
        int startIndex = page * limit;
        int endIndex = Math.min(startIndex + limit, totalElements);

        List<StudentResponse> paginatedStudents = (startIndex < totalElements)
            ? filteredStudents.subList(startIndex, endIndex)
            : new ArrayList<>();

        Pageable pageable = PageRequest.of(page, limit);
        return new PageImpl<>(paginatedStudents, pageable, totalElements);
    }

    @Override
    public StudentDetailResponse getStudentDetail(UUID tutorId, UUID studentId) {
        log.info("BFF: Getting detail for student {} of tutor {}", studentId, tutorId);

        // Get data from Class Service
        TutorStudentDetailResponse classData = classServiceClient.getStudentDetail(tutorId, studentId);

        // Get user info
        UserInfoResponse userInfo = userServiceClient.batchGetUsers(List.of(studentId)).get(studentId);

        // Get student profile from Student Service
        StudentProfileResponse studentProfile = studentServiceClient.getStudentById(studentId);

        // Parse strengths and weaknesses
        List<String> strengths = parseListField(studentProfile.getStrengths());
        List<String> weaknesses = parseListField(studentProfile.getWeaknesses());

        return StudentDetailResponse.builder()
            .id(studentId)
            .name(userInfo != null ? userInfo.getName() : null)
            .avatarUrl(userInfo != null ? userInfo.getAvatarUrl() : null)
            .registeredDate(classData.getRegisteredDate())
            .email(userInfo != null ? userInfo.getEmail() : null)
            .enrollmentTypes(classData.getEnrollmentTypes())
            .status(classData.getStatus())
            .stats(mapStats(classData.getStats()))
            .contact(StudentDetailResponse.ContactInfo.builder()
                .phone(studentProfile.getPhone())
                .joinedDate(classData.getRegisteredDate())
                .build())
            .classInfo(mapClassInfo(classData.getClassInfo()))
            .upcomingSessions(mapUpcomingSessions(classData.getUpcomingSessions()))
            .sessionHistory(mapSessionHistory(classData.getSessionHistory()))
            .strengths(strengths)
            .weaknesses(weaknesses)
            .tutorNotes(classData.getTutorNotes())
            .build();
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
        Map<UUID, UserInfoResponse> userInfoMap = allStudentIds.isEmpty() 
            ? new HashMap<>() 
            : userServiceClient.batchGetUsers(new ArrayList<>(allStudentIds));

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
        if (stats == null) return null;
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
        if (classInfo == null) return null;
        return StudentDetailResponse.ClassInfo.builder()
            .name(classInfo.getName())
            .instructor(classInfo.getInstructor())
            .schedule(classInfo.getSchedule())
            .build();
    }

    private List<StudentDetailResponse.UpcomingSessionInfo> mapUpcomingSessions(
            List<TutorStudentDetailResponse.UpcomingSessionInfo> sessions) {
        if (sessions == null) return new ArrayList<>();
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
        if (sessions == null) return new ArrayList<>();
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
        if (schedules == null) return new ArrayList<>();
        return schedules.stream()
            .map(s -> ClassResponse.ScheduleInfo.builder()
                .day(s.getDay())
                .time(s.getTime())
                .build())
            .collect(Collectors.toList());
    }

    private List<ClassResponse.MaterialInfo> mapMaterials(List<TutorClassResponse.MaterialInfo> materials) {
        if (materials == null) return new ArrayList<>();
        return materials.stream()
            .map(m -> ClassResponse.MaterialInfo.builder()
                .id(m.getId())
                .name(m.getName())
                .type(m.getType())
                .date(m.getDate())
                .build())
            .collect(Collectors.toList());
    }

    @Override
    public TutorProfileResponse getTutorProfile(UUID tutorId) {
        log.info("BFF: Getting tutor profile for tutorId: {}", tutorId);

        // Get tutor data from tutor service
        com.elearning.bffservice.client.dto.TutorProfileResponse tutorData = tutorServiceClient.getTutorProfile(tutorId);
        if (tutorData == null) {
            log.warn("Tutor data not found for tutorId: {}", tutorId);
            return null;
        }

        // Get user data from user service
        UserInfoResponse userData = userServiceClient.getUserById(tutorId);
        if (userData == null) {
            log.warn("User data not found for tutorId: {}", tutorId);
            return null;
        }

        // Get languages from common service
        List<LanguageResponse> allLanguages = commonServiceClient.getAllLanguages();
        Map<String, LanguageResponse> languageMap = allLanguages.stream()
                .collect(Collectors.toMap(LanguageResponse::getCode, lang -> lang));

        // Get countries from common service
        List<CountryResponse> allCountries = commonServiceClient.getAllCountries();
        Map<UUID, CountryResponse> countryMap = allCountries.stream()
                .collect(Collectors.toMap(CountryResponse::getId, country -> country));

        // Get subjects from common service
        List<SubjectResponse> allSubjects = commonServiceClient.getAllSubjects();
        Map<UUID, SubjectResponse> subjectMap = allSubjects.stream()
                .collect(Collectors.toMap(SubjectResponse::getId, subject -> subject));

        // Build the response
        return TutorProfileResponse.builder()
                .fullName(userData.getName())
                .email(userData.getEmail())
                .phone(userData.getPhone())
                .gender(userData.getGender())
                .country(userData.getCountryId() != null && countryMap.containsKey(userData.getCountryId())
                        ? countryMap.get(userData.getCountryId()).getName() : null)
                .city(userData.getCity())
                .nativeLanguage(tutorData.getNationalityCode() != null && languageMap.containsKey(tutorData.getNationalityCode())
                        ? TutorProfileResponse.Language.builder()
                                .id(languageMap.get(tutorData.getNationalityCode()).getId().toString())
                                .name(languageMap.get(tutorData.getNationalityCode()).getName())
                                .code(languageMap.get(tutorData.getNationalityCode()).getCode())
                                .build()
                        : null)
                .languages(tutorData.getLanguages() != null ? tutorData.getLanguages().stream()
                        .filter(lang -> languageMap.containsKey(lang.getLanguageCode()))
                        .map(lang -> TutorProfileResponse.Language.builder()
                                .id(languageMap.get(lang.getLanguageCode()).getId().toString())
                                .name(languageMap.get(lang.getLanguageCode()).getName())
                                .code(languageMap.get(lang.getLanguageCode()).getCode())
                                .build())
                        .collect(Collectors.toList()) : null)
                .headline(tutorData.getSpecialization())
                .subjects(tutorData.getSubjects() != null ? tutorData.getSubjects().stream()
                        .filter(subject -> subject.getSubjectId() != null && subjectMap.containsKey(subject.getSubjectId()))
                        .map(subject -> TutorProfileResponse.Subject.builder()
                                .id(subjectMap.get(subject.getSubjectId()).getId().toString())
                                .name(subjectMap.get(subject.getSubjectId()).getName())
                                .build())
                        .collect(Collectors.toList()) : null)
                .introduction(tutorData.getIntroduction())
                .avatarUrl(userData.getAvatarUrl())
                .introductionVideoUrl(tutorData.getVideoUrl())
                .socialLinks(tutorData.getSocialLinks() != null ? tutorData.getSocialLinks().stream()
                        .map(social -> TutorProfileResponse.SocialLink.builder()
                                .id(social.getId().toString())
                                .platform(social.getPlatform())
                                .url(social.getUrl())
                                .build())
                        .collect(Collectors.toList()) : null)
                .education(tutorData.getCareerEntries() != null ? tutorData.getCareerEntries().stream()
                        .filter(entry -> "EDUCATION".equals(entry.getType()))
                        .map(entry -> TutorProfileResponse.CareerEntry.builder()
                                .id(entry.getId().toString())
                                .title(entry.getTitle())
                                .institution(entry.getInstitution())
                                .startDate(entry.getStartDate() != null ? entry.getStartDate().toString() : null)
                                .endDate(entry.getEndDate() != null ? entry.getEndDate().toString() : null)
                                .location(entry.getLocation())
                                .description(entry.getDescription())
                                .build())
                        .collect(Collectors.toList()) : null)
                .experience(tutorData.getCareerEntries() != null ? tutorData.getCareerEntries().stream()
                        .filter(entry -> "EXPERIENCE".equals(entry.getType()))
                        .map(entry -> TutorProfileResponse.CareerEntry.builder()
                                .id(entry.getId().toString())
                                .title(entry.getTitle())
                                .institution(entry.getInstitution())
                                .startDate(entry.getStartDate() != null ? entry.getStartDate().toString() : null)
                                .endDate(entry.getEndDate() != null ? entry.getEndDate().toString() : null)
                                .location(entry.getLocation())
                                .description(entry.getDescription())
                                .build())
                        .collect(Collectors.toList()) : null)
                .certifications(tutorData.getCertifications() != null ? tutorData.getCertifications().stream()
                        .map(cert -> TutorProfileResponse.Certification.builder()
                                .id(cert.getId().toString())
                                .name(cert.getName())
                                .issuingOrganization(cert.getIssuingOrganization())
                                .issueDate(cert.getIssueDate() != null ? cert.getIssueDate().toString() : null)
                                .expirationDate(cert.getExpirationDate() != null ? cert.getExpirationDate().toString() : null)
                                .credentialId(cert.getCredentialId())
                                .credentialUrl(cert.getCredentialUrl())
                                .build())
                        .collect(Collectors.toList()) : null)
                .build();
    }
    
    @Override
    public List<BookedSessionResponse> getBookedSessions(UUID tutorId, LocalDate startDate, LocalDate endDate, List<ScheduleStatus> statuses) {
        log.info("BFF: Getting booked sessions for tutor {} from {} to {} with statuses {}", 
                tutorId, startDate, endDate, statuses);
        
        // Get sessions from class-service
        List<ClassServiceBookedSessionResponse> classServiceSessions = classServiceClient.getBookedSessions(tutorId, startDate, endDate, statuses);
        
        if (classServiceSessions == null || classServiceSessions.isEmpty()) {
            log.info("No booked sessions found for tutor {}", tutorId);
            return new ArrayList<>();
        }
        
        // Extract unique student IDs (actually user IDs)
        List<UUID> studentIds = classServiceSessions.stream()
                .map(ClassServiceBookedSessionResponse::getStudentId)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
        
        // Batch get user info from user-service
        Map<UUID, UserInfoResponse> userInfoMap = new HashMap<>();
        if (!studentIds.isEmpty()) {
            userInfoMap = userServiceClient.batchGetUsers(studentIds);
        }
        
        // Merge data
        List<BookedSessionResponse> responses = new ArrayList<>();
        for (ClassServiceBookedSessionResponse session : classServiceSessions) {
            UserInfoResponse userInfo = session.getStudentId() != null ? 
                    userInfoMap.get(session.getStudentId()) : null;
            
            BookedSessionResponse response = BookedSessionResponse.builder()
                    .id(session.getId())
                    .studentId(session.getStudentId())
                    .studentName(userInfo != null ? userInfo.getName() : null)
                    .studentAvatarUrl(userInfo != null ? userInfo.getAvatarUrl() : null)
                    .sessionDatetime(session.getSessionDatetime())
                    .durationMinutes(session.getDurationMinutes())
                    .className(session.getClassName())
                    .sessionType(session.getSessionType())
                    .status(session.getStatus())
                    .meetingUrl(session.getMeetingUrl())
                    .notes(session.getNotes())
                    .bookedAt(session.getBookedAt())
                    .updatedAt(session.getUpdatedAt())
                    .build();
            
            responses.add(response);
        }
        
        log.info("BFF: Aggregated {} booked sessions with student details", responses.size());
        return responses;
    }
    
    @Override
    public List<AvailabilityResponse> getAvailabilities(UUID tutorId, LocalDate startDate, LocalDate endDate) {
        log.info("BFF: Getting availabilities for tutor {} from {} to {}", tutorId, startDate, endDate);
        
        // Simply proxy to tutor-service
        List<AvailabilityResponse> availabilities = tutorServiceClient.getAvailabilities(tutorId, startDate, endDate);
        
        log.info("BFF: Retrieved {} availability patterns", availabilities != null ? availabilities.size() : 0);
        return availabilities != null ? availabilities : new ArrayList<>();
    }
    
    @Override
    public void bulkUpdateAvailability(UUID tutorId, BulkUpdateAvailabilityRequest request) {
        log.info("BFF: Bulk updating availability for tutor {} with mode: {}", tutorId, request.getMode());
        
        // Simply proxy to tutor-service
        tutorServiceClient.bulkUpdateAvailability(tutorId, request);
        
        log.info("BFF: Successfully bulk updated availability for tutor {}", tutorId);
    }
}
package com.elearning.bffservice.service.impl;

import com.elearning.bffservice.client.ClassServiceClient;
import com.elearning.bffservice.client.StudentServiceClient;
import com.elearning.bffservice.client.TutorServiceClient;
import com.elearning.bffservice.bff.clas.response.TrialSessionRequestBffResponse;
import com.elearning.bffservice.dto.ApiResponse;
import com.elearning.bffservice.dto.clas.request.TrialSessionRequest;
import com.elearning.bffservice.dto.clas.request.ZoomOAuthCallbackRequest;
import com.elearning.bffservice.dto.clas.response.ZoomAuthorizationUrlResponse;
import com.elearning.bffservice.dto.response.BookedSessionsData;
import com.elearning.bffservice.dto.response.ClassServiceBookedSessionResponse;
import com.elearning.bffservice.dto.response.SessionWithStudents;
import com.elearning.bffservice.dto.response.StudentInSession;
import com.elearning.bffservice.dto.student.response.StudentResponse;
import com.elearning.bffservice.dto.clas.response.TrialSessionRequestResponse;
import com.elearning.bffservice.dto.tutor.response.TutorResponse;
import com.elearning.bffservice.mapper.BookedSessionMapper;
import com.elearning.bffservice.service.ClassService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.time.LocalDate;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClassServiceImpl implements ClassService {

    private final ClassServiceClient classServiceClient;
    private final TutorServiceClient tutorServiceClient;
    private final StudentServiceClient studentServiceClient;

    @Override
    public void saveTrialSessionRequest(TrialSessionRequest request) {
        log.info("Booking trial session for tutor: {} and student: {} at: {}",
                request.getTutorId(), request.getStudentId(), request.getSessionDateTime());
        classServiceClient.saveTrialSessionRequest(request);
        log.info("Trial session booked successfully");
    }

    @Override
    public ZoomAuthorizationUrlResponse getZoomAuthorizationUrl(UUID tutorId) {
        log.info("Getting Zoom authorization URL for tutor: {}", tutorId);
        return classServiceClient.getZoomAuthorizationUrl(tutorId);
    }

    @Override
    public void handleZoomOAuthCallback(ZoomOAuthCallbackRequest request) {
        log.info("Handling Zoom OAuth callback for state: {}", request.getState());
        classServiceClient.handleZoomOAuthCallback(request);
    }

    @Override
    public TrialSessionRequestResponse getTrialSessionRequest(UUID tutorId, UUID studentId) {
        log.info("Getting trial session request for tutor: {} and student: {}", tutorId, studentId);
        return classServiceClient.getTrialSessionRequest(tutorId, studentId).getData();
    }

    @Override
    public List<TrialSessionRequestBffResponse> getTrialSessionRequestsByRole(String role, UUID userId) {
        log.info("Getting trial session requests for role: {} and userId: {}", role, userId);
        Map<UUID, TrialSessionRequestResponse> basicResponses = classServiceClient.getTrialSessionRequestsByRole(role, userId).getData();
        // Collect IDs based on role
        List<UUID> idsToFetch = new ArrayList<>(basicResponses.keySet());
        boolean isTutor = "tutor".equalsIgnoreCase(role);
        // Batch fetch data based on role
        Map<UUID, TutorResponse> tutorsMap = new HashMap<>();
        Map<UUID, StudentResponse> studentsMap = new HashMap<>();
        try {
            if(!idsToFetch.isEmpty()) {
                if (isTutor) {
                    List<StudentResponse> studentsResponse = studentServiceClient.getStudentsByIds(idsToFetch);
                    if (!studentsResponse.isEmpty()) {
                        studentsMap = studentsResponse.stream()
                                .collect(java.util.stream.Collectors.toMap(StudentResponse::getId, s -> s));
                    }
                } else {
                    ApiResponse<Map<UUID, TutorResponse>> tutorsResponse = tutorServiceClient.getTutorsByIds(idsToFetch);
                    if (tutorsResponse != null && tutorsResponse.getData() != null) {
                        tutorsMap = tutorsResponse.getData();
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Failed to batch fetch data for role: {}", role, e);
        }

        // Convert to BFF responses with enriched data
        List<TrialSessionRequestBffResponse> bffResponses = new ArrayList<>();

        for (Map.Entry<UUID, TrialSessionRequestResponse> entry : basicResponses.entrySet()) {
            UUID id = entry.getKey();
            TrialSessionRequestResponse basicResponse = entry.getValue();

            TrialSessionRequestBffResponse bffResponse = TrialSessionRequestBffResponse.builder()
                    .id(basicResponse.getId())
                    .sessionDateTime(basicResponse.getSessionDateTime())
                    .status(basicResponse.getStatus())
                    .createdAt(basicResponse.getCreatedAt())
                    .build();

            if (isTutor) {
                bffResponse.setStudent(studentsMap.get(id));
            } else {
                bffResponse.setTutor(tutorsMap.get(id));
            }

            bffResponses.add(bffResponse);
        }
        return bffResponses;
    }

    @Override
    public void acceptTrialSessionRequest(UUID requestId) {
        log.info("Accepting trial session request with ID: {}", requestId);

        classServiceClient.acceptTrialSessionRequest(requestId);

        log.info("Trial session request accepted successfully");
    }

    @Override
    public BookedSessionsData getBookedSessionsWithStudents(UUID tutorId, LocalDate startDate, LocalDate endDate) {
        log.info("BFF: Getting booked sessions with students for tutor {} from {} to {}", tutorId, startDate, endDate);
        List<ClassServiceBookedSessionResponse> classServiceSessions = fetchBookedSessionsFromClassService(tutorId, startDate, endDate);
        if (classServiceSessions.isEmpty()) {
            log.info("No booked sessions found for tutor {}", tutorId);
            return BookedSessionsData.builder().sessions(new ArrayList<>()).build();
        }
        List<UUID> studentIds = extractStudentIds(classServiceSessions);
        Map<UUID, StudentResponse> studentInfoMap = fetchStudentsByIds(studentIds);
        List<SessionWithStudents> sessions = BookedSessionMapper.toSessionWithStudents(classServiceSessions, studentInfoMap);
        return BookedSessionsData.builder().sessions(sessions).build();
    }

    private List<ClassServiceBookedSessionResponse> fetchBookedSessionsFromClassService(UUID tutorId, LocalDate startDate, LocalDate endDate) {
        ApiResponse<List<ClassServiceBookedSessionResponse>> response = classServiceClient.getBookedSessions(tutorId, startDate, endDate, null);
        return response != null && response.getData() != null ? response.getData() : new ArrayList<>();
    }

    private List<UUID> extractStudentIds(List<ClassServiceBookedSessionResponse> sessions) {
        return sessions.stream()
            .flatMap(session -> session.getStudentIds().stream())
            .filter(Objects::nonNull)
            .distinct()
            .collect(java.util.stream.Collectors.toList());
    }

    private Map<UUID, StudentResponse> fetchStudentsByIds(List<UUID> studentIds) {
        if (studentIds.isEmpty()) {
            return new HashMap<>();
        }
        List<StudentResponse> studentsResponse = studentServiceClient.getStudentsByIds(studentIds);
        return studentsResponse.stream()
            .collect(java.util.stream.Collectors.toMap(StudentResponse::getId, s -> s));
    }
}
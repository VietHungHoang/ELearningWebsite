package com.elearning.bffservice.client;

import com.elearning.bffservice.dto.RestResponsePage;
import com.elearning.bffservice.dto.classes.request.AcceptTrialSessionRequest;
import com.elearning.bffservice.dto.classes.response.*;
import com.elearning.bffservice.dto.classes.request.ZoomOAuthCallbackRequest;
import com.elearning.bffservice.dto.ApiResponse;
import com.elearning.bffservice.dto.response.*;
import com.elearning.bffservice.dto.tutor.response.MonthlyStudentStats;
import com.elearning.bffservice.dto.enums.ScheduleStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

/**
 * Client for Class Service
 */
@Component
@RequiredArgsConstructor
public class ClassServiceClient {
    
    private final RestTemplate restTemplate;

    @Value("${services.class-service.url}")
    private String classServiceBaseUrl;

    /**
     * Get tutor students from Class Service
     */
    public Page<TutorStudentResponse> getTutorStudents(UUID tutorId, int page, int size) {
        URI url = UriComponentsBuilder
            .fromHttpUrl(classServiceBaseUrl + "/api/v1/tutors/{tutorId}/students")
            .queryParam("page", page)
            .queryParam("size", size)
            .buildAndExpand(tutorId)
            .toUri();

        return restTemplate.exchange(
            url,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<RestResponsePage<TutorStudentResponse>>() {}
        ).getBody();
    }
    
    /**
     * Get student detail from Class Service
     */
    public ApiResponse<TutorStudentDetailResponse> getStudentDetail(UUID tutorId, UUID studentId) {
        String url = classServiceBaseUrl + "/api/v1/tutors/" + tutorId + "/students/" + studentId;
        
        return restTemplate.exchange(
            url,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<ApiResponse<TutorStudentDetailResponse>>() {}
        ).getBody();
    }
    
    /**
     * Get tutor classes from Class Service
     */
    public Page<TutorClassResponse> getClasses(UUID tutorId, int page, int size) {
        URI url = UriComponentsBuilder
            .fromHttpUrl(classServiceBaseUrl + "/api/v1/tutors/{tutorId}/classes")
            .queryParam("page", page)
            .queryParam("size", size)
            .buildAndExpand(tutorId)
            .toUri();

        return restTemplate.exchange(
            url,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<RestResponsePage<TutorClassResponse>>() {}
        ).getBody();
    }
    
    /**
     * Get class detail from Class Service
     */
    public ApiResponse<com.elearning.bffservice.dto.response.ClassDetailResponse> getClassDetail(UUID tutorId, UUID classId) {
        String url = classServiceBaseUrl + "/api/v1/tutors/" + tutorId + "/classes/" + classId;
        
        return restTemplate.exchange(
            url,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<ApiResponse<com.elearning.bffservice.dto.response.ClassDetailResponse>>() {}
        ).getBody();
    }
    
    /**
     * Get booked sessions from Class Service
     */
    public ApiResponse<List<ClassServiceBookedSessionResponse>> getBookedSessions(UUID tutorId, LocalDate startDate, LocalDate endDate, List<ScheduleStatus> statuses) {
        UriComponentsBuilder builder = UriComponentsBuilder
            .fromHttpUrl(classServiceBaseUrl + "/api/v1/classes/sessions/tutors/{tutorId}")
            .queryParam("startDate", startDate)
            .queryParam("endDate", endDate);
        
        if (statuses != null && !statuses.isEmpty()) {
            builder.queryParam("statuses", statuses);
        }
        
        URI url = builder.buildAndExpand(tutorId).toUri();
        
        ApiResponse<List<ClassServiceBookedSessionResponse>> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<ApiResponse<List<ClassServiceBookedSessionResponse>>>() {}
        ).getBody();

        return response;
    }

    /**
     * Get booked sessions for student from Class Service
     */
    public ApiResponse<List<ClassServiceBookedSessionResponse>> getBookedSessionsForStudent(UUID studentId, LocalDate startDate, LocalDate endDate, List<ScheduleStatus> statuses) {
        UriComponentsBuilder builder = UriComponentsBuilder
            .fromHttpUrl(classServiceBaseUrl + "/api/v1/classes/sessions/students/{studentId}")
            .queryParam("startDate", startDate)
            .queryParam("endDate", endDate);
        
        if (statuses != null && !statuses.isEmpty()) {
            builder.queryParam("statuses", statuses);
        }
        
        URI url = builder.buildAndExpand(studentId).toUri();
        
        ApiResponse<List<ClassServiceBookedSessionResponse>> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<ApiResponse<List<ClassServiceBookedSessionResponse>>>() {}
        ).getBody();

        return response;
    }
    
    /**
     * Get tutor stats from Class Service
     */
    public ApiResponse<List<TutorStatsResponse>> getTutorStats(List<UUID> tutorIds, UUID studentId) {
        UriComponentsBuilder builder = UriComponentsBuilder
            .fromHttpUrl(classServiceBaseUrl + "/api/v1/tutors/stats");
        
        for (UUID tutorId : tutorIds) {
            builder.queryParam("tutorIds", tutorId);
        }
        
        if (studentId != null) {
            builder.queryParam("studentId", studentId);
        }
        
        URI url = builder.build().toUri();
        
        return restTemplate.exchange(
            url,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<ApiResponse<List<TutorStatsResponse>>>() {}
        ).getBody();
    }

    /**
     * Get group classes for a tutor from Class Service
     */
    public ApiResponse<List<GroupClassResponse>> getGroupClasses(UUID tutorId) {
        String url = classServiceBaseUrl + "/api/v1/tutors/" + tutorId + "/group-classes";

        return restTemplate.exchange(
            url,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<ApiResponse<List<GroupClassResponse>>>() {}
        ).getBody();
    }

    /**
     * Accept a trial session request
     */
    public ApiResponse<Void> acceptTrialSessionRequest(UUID requestId) {
        String url = classServiceBaseUrl + "/api/v1/class/trial-session/accept";

        AcceptTrialSessionRequest request = new AcceptTrialSessionRequest();
        request.setRequestId(requestId);

        HttpEntity<AcceptTrialSessionRequest> entity = new HttpEntity<>(request);

        return restTemplate.exchange(
            url,
            HttpMethod.POST,
            entity,
            new ParameterizedTypeReference<ApiResponse<Void>>() {}
        ).getBody();
    }

    /**
     * Get Zoom authorization URL for tutor
     */
    public ZoomAuthorizationUrlResponse getZoomAuthorizationUrl(UUID tutorId) {
        URI url = UriComponentsBuilder
            .fromHttpUrl(classServiceBaseUrl + "/api/v1/zoom/oauth/authorize")
            .queryParam("tutorId", tutorId)
            .build()
            .toUri();

        ApiResponse<ZoomAuthorizationUrlResponse> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<ApiResponse<ZoomAuthorizationUrlResponse>>() {}
        ).getBody();

        return response.getData();
    }

    /**
     * Handle Zoom OAuth callback
     */
    public void handleZoomOAuthCallback(ZoomOAuthCallbackRequest request) {
        URI uri = UriComponentsBuilder
            .fromHttpUrl(classServiceBaseUrl + "/api/v1/zoom/oauth/callback")
            .build()
            .toUri();

        restTemplate.postForEntity(uri, request, Void.class);
    }

    /**
     * Get list of trial session requests by role and user ID
     */
    public ApiResponse<Map<UUID, TrialSessionRequestResponse>> getTrialSessionRequestsByRole(String role, UUID userId) {
        URI url = UriComponentsBuilder
            .fromHttpUrl(classServiceBaseUrl + "/api/v1/class/trial-session/list")
            .queryParam("role", role)
            .queryParam("userId", userId)
            .build()
            .toUri();

        return restTemplate.exchange(
            url,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<ApiResponse<Map<UUID, TrialSessionRequestResponse>>>() {}
        ).getBody();
    }

    /**
     * Get student stats from Class Service
     */
    public ClassStatisticsResponse getStudentStats(UUID tutorId, LocalDateTime startDate, LocalDateTime endDate) {
        URI url = UriComponentsBuilder
                .fromHttpUrl(classServiceBaseUrl + "/api/v1/classes/{tutorId}/students/stats")
                .queryParam("startDate", startDate)
                .queryParam("endDate", endDate)
                .buildAndExpand(tutorId)
                .toUri();

        return restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                ClassStatisticsResponse.class
        ).getBody();
    }

    /**
     * Get booked sessions for user from Class Service
     */
    public ApiResponse<List<BookedSessionResponse>> getBookedSessionsForUser(UUID userId, LocalDateTime startDate, LocalDateTime endDate) {
        URI url = UriComponentsBuilder
                .fromHttpUrl(classServiceBaseUrl + "/api/v1/classes/sessions/me")
                .queryParam("startDate", startDate)
                .queryParam("endDate", endDate)
                .build()
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-Id", userId.toString());

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ApiResponse<List<BookedSessionResponse>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<ApiResponse<List<BookedSessionResponse>>>() {}
        ).getBody();

        return response;
    }

    /**
     * Get monthly student statistics for tutor
     */
    public ApiResponse<List<MonthlyStudentStats>> getMonthlyStudentStats(UUID tutorId) {
        URI url = UriComponentsBuilder
                .fromHttpUrl(classServiceBaseUrl + "/api/v1/classes/statistics/me/students")
                .build()
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-Id", tutorId.toString());

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        return restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<ApiResponse<List<MonthlyStudentStats>>>() {}
        ).getBody();
    }
}

package com.elearning.bffservice.client;

import com.elearning.bffservice.dto.RestResponsePage;
import com.elearning.bffservice.dto.clas.request.AcceptTrialSessionRequest;
import com.elearning.bffservice.dto.clas.request.TrialSessionRequest;
import com.elearning.bffservice.dto.clas.response.GroupClassResponse;
import com.elearning.bffservice.dto.clas.request.ZoomOAuthCallbackRequest;
import com.elearning.bffservice.dto.clas.response.ZoomAuthorizationUrlResponse;
import com.elearning.bffservice.dto.ApiResponse;
import com.elearning.bffservice.dto.response.ClassServiceBookedSessionResponse;
import com.elearning.bffservice.dto.clas.response.TrialSessionRequestResponse;
import com.elearning.bffservice.dto.response.TutorStudentResponse;
import com.elearning.bffservice.dto.clas.response.TutorStatsResponse;
import com.elearning.bffservice.dto.response.TutorStudentDetailResponse;
import com.elearning.bffservice.dto.response.TutorClassResponse;
import com.elearning.bffservice.dto.enums.ScheduleStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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
     * Book a trial session from Class Service
     */
    public ApiResponse<Void> saveTrialSessionRequest(TrialSessionRequest request) {
        String url = classServiceBaseUrl + "/api/v1/class/trial-session";

        HttpEntity<TrialSessionRequest> entity = new HttpEntity<>(request);

        return restTemplate.exchange(
            url,
            HttpMethod.POST,
            entity,
            new ParameterizedTypeReference<ApiResponse<Void>>() {}
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
     * Get trial session request for a tutor and student
     */
    public ApiResponse<TrialSessionRequestResponse> getTrialSessionRequest(UUID tutorId, UUID studentId) {
        URI url = UriComponentsBuilder
            .fromHttpUrl(classServiceBaseUrl + "/api/v1/class/trial-session")
            .queryParam("tutorId", tutorId)
            .queryParam("studentId", studentId)
            .build()
            .toUri();

        return restTemplate.exchange(
            url,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<ApiResponse<TrialSessionRequestResponse>>() {}
        ).getBody();
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
}

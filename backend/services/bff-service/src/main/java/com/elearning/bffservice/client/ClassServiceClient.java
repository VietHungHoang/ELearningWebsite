package com.elearning.bffservice.client;

import com.elearning.bffservice.dto.response.ClassServiceBookedSessionResponse;
import com.elearning.bffservice.dto.response.TutorStudentResponse;
import com.elearning.bffservice.dto.response.TutorStudentDetailResponse;
import com.elearning.bffservice.dto.response.TutorClassResponse;
import com.elearning.bffservice.dto.response.enums.ScheduleStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;
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
    public TutorStudentDetailResponse getStudentDetail(UUID tutorId, UUID studentId) {
        String url = classServiceBaseUrl + "/api/v1/tutors/" + tutorId + "/students/" + studentId;
        
        return restTemplate.exchange(
            url,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<TutorStudentDetailResponse>() {}
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
    public com.elearning.bffservice.dto.response.ClassDetailResponse getClassDetail(UUID tutorId, UUID classId) {
        String url = classServiceBaseUrl + "/api/v1/tutors/" + tutorId + "/classes/" + classId;
        
        return restTemplate.exchange(
            url,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<com.elearning.bffservice.dto.response.ClassDetailResponse>() {}
        ).getBody();
    }
    
    /**
     * Get booked sessions from Class Service
     */
    public List<ClassServiceBookedSessionResponse> getBookedSessions(UUID tutorId, LocalDate startDate, LocalDate endDate, List<ScheduleStatus> statuses) {
        UriComponentsBuilder builder = UriComponentsBuilder
            .fromHttpUrl(classServiceBaseUrl + "/api/v1/sessions/booked")
            .queryParam("tutorId", tutorId)
            .queryParam("startDate", startDate)
            .queryParam("endDate", endDate);
        
        if (statuses != null && !statuses.isEmpty()) {
            builder.queryParam("statuses", statuses);
        }
        
        URI url = builder.build().toUri();
        
        return restTemplate.exchange(
            url,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<List<ClassServiceBookedSessionResponse>>() {}
        ).getBody();
    }
}

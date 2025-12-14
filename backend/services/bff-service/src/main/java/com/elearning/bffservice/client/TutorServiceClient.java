package com.elearning.bffservice.client;

import com.elearning.bffservice.dto.request.BulkUpdateAvailabilityRequest;
import com.elearning.bffservice.dto.request.UpdateOnboardingRequest;
import com.elearning.bffservice.dto.ApiResponse;
import com.elearning.bffservice.dto.tutor.response.AvailabilityListResponse;
import com.elearning.bffservice.dto.response.OnboardingResponse;
import com.elearning.bffservice.dto.tutor.response.TutorDetailResponse;
import com.elearning.bffservice.dto.tutor.response.TutorResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
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

@Component
@RequiredArgsConstructor
public class TutorServiceClient {
    private final RestTemplate restTemplate;

    @Value("${services.tutor-service.url}")
    private String tutorServiceBaseUrl;

    /**
     * Get tutors by list of IDs (for search enrichment)
     */
    public ApiResponse<Map<UUID, TutorResponse>> getTutorsByIds(List<UUID> tutorIds) {
        if (tutorIds == null || tutorIds.isEmpty()) {
            return ApiResponse.success(Map.of(), "No tutors found");
        }

        String url = UriComponentsBuilder
                .fromHttpUrl(tutorServiceBaseUrl + "/tutors/batch")
                .queryParam("tutorIds", tutorIds)
                .toUriString();

        return restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<ApiResponse<Map<UUID, TutorResponse>>>() {}
        ).getBody();
    }
    
    public ApiResponse<TutorDetailResponse> getTutorDetail(UUID tutorId) {
        String url = tutorServiceBaseUrl + "/api/v1/tutors/" + tutorId + "/detail";
        return restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<ApiResponse<TutorDetailResponse>>() {}
        ).getBody();
    }
    
    public ApiResponse<AvailabilityListResponse> getAvailabilities(UUID tutorId, LocalDate startDate, LocalDate endDate) {
        URI url = UriComponentsBuilder
                .fromHttpUrl(tutorServiceBaseUrl + "/tutors/{tutorId}/availabilities")
                .queryParam("startDate", startDate)
                .queryParam("endDate", endDate)
                .buildAndExpand(tutorId)
                .toUri();
        
        return restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<ApiResponse<AvailabilityListResponse>>() {}
        ).getBody();
    }
    
    public void bulkUpdateAvailability(UUID tutorId, BulkUpdateAvailabilityRequest request) {
        String url = tutorServiceBaseUrl + "/tutors/" + tutorId + "/availability/bulk";
        
        HttpEntity<BulkUpdateAvailabilityRequest> entity = new HttpEntity<>(request);
        
        restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                Void.class
        );
    }
    
    public ApiResponse<OnboardingResponse> getOnboarding(UUID tutorId) {
        String url = tutorServiceBaseUrl + "/api/v1/tutors/" + tutorId + "/onboarding";
        return restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<ApiResponse<OnboardingResponse>>() {}
        ).getBody();
    }

    public void updateOnboarding(UUID tutorId, UpdateOnboardingRequest request) {
        String url = tutorServiceBaseUrl + "/api/v1/tutors/" + tutorId + "/onboarding";
        
        HttpEntity<UpdateOnboardingRequest> entity = new HttpEntity<>(request);
        
        restTemplate.exchange(
                url,
                HttpMethod.PUT,
                entity,
                Void.class
        );
    }
    
    public void updateOnboarding(UUID tutorId, int step, UpdateOnboardingRequest request) {
        String url = tutorServiceBaseUrl + "/api/v1/tutors/" + tutorId + "/onboarding/step/" + step;
        
        HttpEntity<UpdateOnboardingRequest> entity = new HttpEntity<>(request);
        
        restTemplate.exchange(
                url,
                HttpMethod.PUT,
                entity,
                Void.class
        );
    }

    /**
     * Get tutor by ID
     */
    public TutorResponse getTutorById(UUID tutorId) {
        String url = tutorServiceBaseUrl + "/api/v1/tutors/" + tutorId;

        return restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<ApiResponse<TutorResponse>>() {}
        ).getBody().getData();
    }
}
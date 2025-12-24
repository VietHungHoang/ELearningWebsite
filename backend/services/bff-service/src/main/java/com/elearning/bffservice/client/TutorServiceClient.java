package com.elearning.bffservice.client;

import com.elearning.bffservice.dto.request.BulkUpdateAvailabilityRequest;
import com.elearning.bffservice.dto.request.UpdateOnboardingRequest;
import com.elearning.bffservice.dto.ApiResponse;
import com.elearning.bffservice.dto.tutor.response.AvailabilityListResponse;
import com.elearning.bffservice.dto.tutor.response.MonthlyIncomeStats;
import com.elearning.bffservice.dto.response.OnboardingResponse;
import com.elearning.bffservice.dto.tutor.response.TutorDetailResponse;
import com.elearning.bffservice.dto.tutor.response.TutorResponse;
import com.elearning.bffservice.dto.tutor.response.TutorDashboardStatisticsResponse;
import com.elearning.bffservice.exception.ServiceCallException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
    public List<TutorResponse> getTutorsByIds(List<UUID> tutorIds) throws ServiceCallException {
        if (tutorIds == null || tutorIds.isEmpty()) {
            return List.of();
        }

        String url = UriComponentsBuilder
                .fromHttpUrl(tutorServiceBaseUrl + "/api/v1/tutors/batch")
                .queryParam("ids", tutorIds)
                .toUriString();

        try {
            ApiResponse<List<TutorResponse>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<ApiResponse<List<TutorResponse>>>() {}
            ).getBody();
            return response != null ? response.getData() : List.of();
        } catch (Exception e) {
            throw new ServiceCallException("Failed to fetch tutors from tutor service: " + e.getMessage(), e);
        }
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

    public ApiResponse<TutorDashboardStatisticsResponse> getTutorStats(UUID tutorId, LocalDateTime startDate, LocalDateTime endDate) {
        URI url = UriComponentsBuilder
                .fromHttpUrl(tutorServiceBaseUrl + "/api/v1/tutors/{tutorId}/stats")
                .queryParam("startDate", startDate)
                .queryParam("endDate", endDate)
                .buildAndExpand(tutorId)
                .toUri();

        return restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<ApiResponse<TutorDashboardStatisticsResponse>>() {}
        ).getBody();
    }

    /**
     * Get monthly income statistics for tutor
     */
    public ApiResponse<List<MonthlyIncomeStats>> getMonthlyIncomeStats(UUID tutorId) {
        URI url = UriComponentsBuilder
                .fromHttpUrl(tutorServiceBaseUrl + "/api/v1/tutors/me/income")
                .build()
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-Id", tutorId.toString());

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        return restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<ApiResponse<List<MonthlyIncomeStats>>>() {}
        ).getBody();
    }
}
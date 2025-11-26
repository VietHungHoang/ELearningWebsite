package com.elearning.bffservice.client;

import com.elearning.bffservice.dto.request.BulkUpdateAvailabilityRequest;
import com.elearning.bffservice.dto.response.AvailabilityResponse;
import com.elearning.bffservice.dto.response.TutorSearchResponse;
import com.elearning.bffservice.client.dto.TutorProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class TutorServiceClient {
    private final RestTemplate restTemplate;

    @Value("${services.tutor-service.url}")
    private String tutorServiceBaseUrl;

    public Page<TutorSearchResponse> searchTutors(List<String> languageCodes, BigDecimal minPrice, BigDecimal maxPrice, List<UUID> categoryIds, List<String> availableDays, int page, int size) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(tutorServiceBaseUrl + "/api/v1/tutors/search")
                .queryParam("page", page)
                .queryParam("size", size);

        if (languageCodes != null && !languageCodes.isEmpty()) {
            for (String code : languageCodes) builder.queryParam("languageCodes", code);
        }
        if (minPrice != null) builder.queryParam("minPrice", minPrice);
        if (maxPrice != null) builder.queryParam("maxPrice", maxPrice);
        if (categoryIds != null && !categoryIds.isEmpty()) {
            for (UUID id : categoryIds) builder.queryParam("categoryIds", id);
        }
        if (availableDays != null && !availableDays.isEmpty()) {
            for (String d : availableDays) builder.queryParam("availableDays", d);
        }

        URI url = builder.build().toUri();

        return restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Page<TutorSearchResponse>>() {}
        ).getBody();
    }

    public TutorProfileResponse getTutorProfile(UUID tutorId) {
        String url = tutorServiceBaseUrl + "/tutors/" + tutorId + "/profile";
        return restTemplate.getForObject(url, TutorProfileResponse.class);
    }
    
    /**
     * Get tutors by list of IDs (for search enrichment)
     */
    public List<TutorSearchResponse> getTutorsByIds(List<UUID> tutorIds) {
        if (tutorIds == null || tutorIds.isEmpty()) {
            return List.of();
        }
        
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl(tutorServiceBaseUrl + "/api/v1/tutors/batch");
        
        for (UUID id : tutorIds) {
            builder.queryParam("ids", id);
        }
        
        URI url = builder.build().toUri();
        
        return restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<TutorSearchResponse>>() {}
        ).getBody();
    }
    
    public List<AvailabilityResponse> getAvailabilities(UUID tutorId, LocalDate startDate, LocalDate endDate) {
        URI url = UriComponentsBuilder
                .fromHttpUrl(tutorServiceBaseUrl + "/tutors/{tutorId}/availability")
                .queryParam("startDate", startDate)
                .queryParam("endDate", endDate)
                .buildAndExpand(tutorId)
                .toUri();
        
        return restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<AvailabilityResponse>>() {}
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
}
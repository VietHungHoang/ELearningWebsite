package com.elearning.bffservice.client;

import com.elearning.bffservice.dto.response.TutorSearchResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.net.URI;
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
}
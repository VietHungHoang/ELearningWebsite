package com.elearning.bffservice.client;

import com.elearning.bffservice.dto.response.CategoryResponse;
import com.elearning.bffservice.dto.response.LanguageResponse;
import com.elearning.bffservice.dto.response.TimezoneResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CommonServiceClient {
    private final RestTemplate restTemplate;

    @Value("${services.common-service.url}")
    private String commonServiceBaseUrl;

    public List<CategoryResponse> getAllCategories() {
        try {
            String url = commonServiceBaseUrl + "/api/v1/common/categories";
            List<CategoryResponse> result = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<CategoryResponse>>() {
                    }).getBody();
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch categories", e);
        }
    }

    public List<LanguageResponse> getAllLanguages() {
        try {
            String url = commonServiceBaseUrl + "/api/v1/common/languages";
            List<LanguageResponse> result = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<LanguageResponse>>() {
                    }).getBody();
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch languages", e);
        }
    }

    public List<TimezoneResponse> getAllTimezones() {
        try {
            String url = commonServiceBaseUrl + "/api/v1/common/timezones";
            List<TimezoneResponse> result = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<TimezoneResponse>>() {
                    }).getBody();
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch timezones", e);
        }
    }
}
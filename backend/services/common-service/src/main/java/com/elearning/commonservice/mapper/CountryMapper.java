package com.elearning.commonservice.mapper;

import com.elearning.commonservice.dto.response.CountryResponse;
import com.elearning.commonservice.entity.Country;
import org.springframework.stereotype.Component;

@Component
public class CountryMapper {

    public CountryResponse toResponse(Country country) {
        return CountryResponse.builder()
                .id(country.getId())
                .name(country.getName())
                .createdAt(country.getCreatedAt())
                .updatedAt(country.getUpdatedAt())
                .build();
    }
}
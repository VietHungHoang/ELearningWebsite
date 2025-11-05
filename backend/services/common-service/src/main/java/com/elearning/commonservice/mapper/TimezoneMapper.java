package com.elearning.commonservice.mapper;

import com.elearning.commonservice.dto.request.TimezoneRequest;
import com.elearning.commonservice.dto.response.TimezoneResponse;
import com.elearning.commonservice.entity.Timezone;
import org.springframework.stereotype.Component;

@Component
public class TimezoneMapper {

    public Timezone toEntity(TimezoneRequest request) {
        return Timezone.builder()
                .name(request.getName())
                .utcOffset(request.getUtcOffset())
                .build();
    }

    public TimezoneResponse toResponse(Timezone timezone) {
        return TimezoneResponse.builder()
                .id(timezone.getId())
                .name(timezone.getName())
                .utcOffset(timezone.getUtcOffset())
                .createdAt(timezone.getCreatedAt())
                .updatedAt(timezone.getUpdatedAt())
                .build();
    }
}
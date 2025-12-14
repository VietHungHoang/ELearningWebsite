package com.elearning.commonservice.mapper;

import com.elearning.commonservice.dto.request.LanguageRequest;
import com.elearning.commonservice.dto.response.LanguageResponse;
import com.elearning.commonservice.entity.Language;
import org.springframework.stereotype.Component;

@Component
public class LanguageMapper {

    public Language toEntity(LanguageRequest request) {
        return Language.builder()
                .name(request.getName())
                .code(request.getCode())
                .build();
    }

    public LanguageResponse toResponse(Language language) {
        return LanguageResponse.builder()
                .name(language.getName())
                .code(language.getCode())
                .build();
    }
}
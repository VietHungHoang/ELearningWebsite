package com.elearning.courseservice.mapper;

import com.elearning.courseservice.dto.response.LanguageResponse;
import com.elearning.courseservice.model.Language;

public class LanguageMapper {

    /**
     * Convert Language entity to LanguageResponse DTO
     */
    public static LanguageResponse toResponse(Language language) {
        if (language == null) {
            return null;
        }

        return LanguageResponse.builder()
                .id(language.getId())
                .name(language.getName())
                .nativeName(language.getNativeName())
                .build();
    }
}
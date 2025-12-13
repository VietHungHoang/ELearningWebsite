package com.elearning.testservice.dto;

import lombok.Data;

@Data
public class TutorLanguageRequest {
    private String languageCode;
    private String proficiencyLevel;
}
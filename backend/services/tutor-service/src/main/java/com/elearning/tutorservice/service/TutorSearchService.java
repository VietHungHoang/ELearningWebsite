package com.elearning.tutorservice.service;

import com.elearning.tutorservice.dto.response.TutorResponse;

import java.util.List;
import java.util.UUID;

public interface TutorSearchService {
    List<TutorResponse> getTutorsByIds(List<UUID> tutorIds);
}
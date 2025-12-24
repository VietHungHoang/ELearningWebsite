package com.elearning.bffservice.service;

import com.elearning.bffservice.bff.tutors.request.TutorSearchBffRequest;
import com.elearning.bffservice.bff.tutors.response.TutorBffResponse;
import org.springframework.data.domain.Page;

public interface SearchService {
    Page<TutorBffResponse> searchTutors(TutorSearchBffRequest request);
}
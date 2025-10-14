package com.elearning.learner_service.service;

import com.elearning.learner_service.dto.request.ProfileUpdateRequest;
import com.elearning.learner_service.dto.response.ProfileResponse;

public interface ProfileService {
    ProfileResponse getProfile(Long accountId);

    ProfileResponse updateProfile(Long accountId, ProfileUpdateRequest profile);
}

package com.elearning.learner_bff_service.service;

import com.elearning.learner_bff_service.dto.request.ProfileUpdateRequest;
import java.util.Map;

public interface ProfileService {
    Map<String, Object> getProfile(Long accountId);

    Map<String, Object> updateProfile(Long accountId, ProfileUpdateRequest profileUpdate);
}

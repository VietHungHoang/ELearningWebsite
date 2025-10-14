package com.elearning.learner_service.service.impl;

import com.elearning.learner_service.client.UserServiceClient;
import com.elearning.learner_service.dto.request.ProfileUpdateRequest;
import com.elearning.learner_service.dto.response.ProfileResponse;
import com.elearning.learner_service.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserServiceClient userServiceClient;

    @Override
    public ProfileResponse getProfile(Long accountId) {
        return userServiceClient.getProfile(accountId);
    }

    @Override
    public ProfileResponse updateProfile(Long accountId, ProfileUpdateRequest profile) {
        return userServiceClient.updateProfile(accountId, profile);
    }
}

package com.elearning.apigateway.service;

import java.util.Map;

import com.elearning.apigateway.dto.request.ProfileUpdateRequest;

public interface ProfileService {
    Map<String, Object> getProfile(Long accountId);

    Map<String, Object> updateProfile(Long accountId, ProfileUpdateRequest profileUpdate);
}


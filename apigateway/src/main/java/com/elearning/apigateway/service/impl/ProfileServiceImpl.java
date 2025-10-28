package com.elearning.apigateway.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.elearning.apigateway.client.LearnerServiceClient;
import com.elearning.apigateway.dto.request.ProfileUpdateRequest;
import com.elearning.apigateway.service.ProfileService;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final LearnerServiceClient learnerServiceClient;

    @Override
    public Map<String, Object> getProfile(Long accountId) {
        log.info("BFF Service: Getting profile for accountId: {}", accountId);
        return learnerServiceClient.getProfile(accountId);
    }

    @Override
    public Map<String, Object> updateProfile(Long accountId, ProfileUpdateRequest profileUpdate) {
        log.info("BFF Service: Updating profile for accountId: {}", accountId);

        Map<String, Object> profileMap = new HashMap<>();
        if (profileUpdate.getFirstName() != null)
            profileMap.put("firstName", profileUpdate.getFirstName());
        if (profileUpdate.getLastName() != null)
            profileMap.put("lastName", profileUpdate.getLastName());
        if (profileUpdate.getPhoneNumber() != null)
            profileMap.put("phoneNumber", profileUpdate.getPhoneNumber());
        if (profileUpdate.getAvatar() != null)
            profileMap.put("avatar", profileUpdate.getAvatar());
        if (profileUpdate.getBio() != null)
            profileMap.put("bio", profileUpdate.getBio());
        if (profileUpdate.getCountry() != null)
            profileMap.put("country", profileUpdate.getCountry());
        if (profileUpdate.getCity() != null)
            profileMap.put("city", profileUpdate.getCity());

        return learnerServiceClient.updateProfile(accountId, profileMap);
    }
}


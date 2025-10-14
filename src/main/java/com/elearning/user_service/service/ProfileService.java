package com.elearning.user_service.service;

import com.elearning.user_service.dto.request.ProfileRequest;
import com.elearning.user_service.dto.response.ProfileResponse;

public interface ProfileService {

    // (2) Tạo hoặc cập nhật hồ sơ cá nhân (chỉ cho learner/instructor)
    ProfileResponse createOrUpdateProfile(Long accountId, ProfileRequest request);

    // (2) Xem hồ sơ người dùng (frontend, admin, learner-service có thể gọi)
    ProfileResponse getProfileByAccountId(Long accountId);
}

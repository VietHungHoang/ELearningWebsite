package com.elearning.learner_service.controller;

import com.elearning.learner_service.dto.request.ProfileUpdateRequest;
import com.elearning.learner_service.dto.response.ApiResponse;
import com.elearning.learner_service.dto.response.ProfileResponse;
import com.elearning.learner_service.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/learners/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/{accountId}")
    public ApiResponse<ProfileResponse> getProfile(@PathVariable Long accountId) {
        ProfileResponse profile = profileService.getProfile(accountId);
        return ApiResponse.success(profile, "Lấy profile thành công");
    }

    @PatchMapping("/{accountId}") // dùng PATCH để cập nhật một số field
    public ApiResponse<ProfileResponse> updateProfile(
            @PathVariable Long accountId,
            @RequestBody ProfileUpdateRequest profileUpdate) {
        ProfileResponse updated = profileService.updateProfile(accountId, profileUpdate);
        return ApiResponse.success(updated, "Cập nhật profile thành công");
    }
}


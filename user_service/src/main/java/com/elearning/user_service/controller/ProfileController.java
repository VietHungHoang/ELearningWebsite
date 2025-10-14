package com.elearning.user_service.controller;

import com.elearning.user_service.dto.request.ProfileRequest;
import com.elearning.user_service.dto.response.ApiResponse;
import com.elearning.user_service.dto.response.ProfileResponse;
import com.elearning.user_service.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    /**
     * ✅ Lấy thông tin hồ sơ theo accountId
     */
    @GetMapping("/{accountId}")
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfileByAccountId(
            @PathVariable Long accountId) {
        try {
            ProfileResponse response = profileService.getProfileByAccountId(accountId);
            return ResponseEntity.ok(
                    ApiResponse.success(response, "Lấy thông tin hồ sơ thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(
                    ApiResponse.error(404, e.getMessage()));
        }
    }

    /**
     * ✅ Tạo hoặc cập nhật hồ sơ cá nhân
     */
    @PutMapping("/{accountId}")
    public ResponseEntity<ApiResponse<ProfileResponse>> createOrUpdateProfile(
            @PathVariable Long accountId,
            @RequestBody ProfileRequest request) {
        try {
            ProfileResponse response = profileService.createOrUpdateProfile(accountId, request);
            return ResponseEntity.ok(
                    ApiResponse.success(response, "Cập nhật hồ sơ thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(
                    ApiResponse.error(400, e.getMessage()));
        }
    }
}

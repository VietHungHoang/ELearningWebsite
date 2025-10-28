package com.elearning.apigateway.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import com.elearning.apigateway.dto.request.ProfileUpdateRequest;
import com.elearning.apigateway.dto.response.ApiResponse;
import com.elearning.apigateway.service.ProfileService;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/learners/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/{accountId}")
    public ApiResponse<Map<String, Object>> getProfile(@PathVariable Long accountId) {
        return ApiResponse.success(profileService.getProfile(accountId), "Lấy thông tin cá nhân thành công");
    }

    @PatchMapping("/{accountId}")
    public ApiResponse<Map<String, Object>> updateProfile(
            @PathVariable Long accountId,
            @RequestBody ProfileUpdateRequest profileUpdate) {
        return ApiResponse.success(profileService.updateProfile(accountId, profileUpdate),
                "Cập nhật thông tin cá nhân thành công");
    }
}


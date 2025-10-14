package com.elearning.user_service.service.impl;

import com.elearning.user_service.dto.request.ProfileRequest;
import com.elearning.user_service.dto.response.ProfileResponse;
import com.elearning.user_service.model.Account;
import com.elearning.user_service.model.Profile;
import com.elearning.user_service.repository.AccountRepository;
import com.elearning.user_service.repository.ProfileRepository;
import com.elearning.user_service.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;
    private final AccountRepository accountRepository;

    @Override
    public ProfileResponse getProfileByAccountId(Long accountId) {
        Profile profile = profileRepository.findByAccountId(accountId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ của account ID: " + accountId));
        return mapToResponse(profile);
    }

    @Override
    public ProfileResponse createOrUpdateProfile(Long accountId, ProfileRequest request) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản để cập nhật profile"));

        if (account.getRole().name().equals("ADMIN")) {
            throw new RuntimeException("Admin không có profile để cập nhật");
        }

        Profile profile = profileRepository.findByAccountId(accountId)
                .orElseGet(() -> {
                    Profile newProfile = new Profile();
                    newProfile.setAccount(account);
                    return newProfile;
                });

        profile.setFullName(request.getFullName());
        profile.setPhone(request.getPhone());
        profile.setAvatar(request.getAvatarUrl());
        profile.setBio(request.getBio());

        Profile saved = profileRepository.save(profile);
        return mapToResponse(saved);
    }

    // ---- Helper ----
    private ProfileResponse mapToResponse(Profile profile) {
        return ProfileResponse.builder()
                .id(profile.getId())
                .accountId(profile.getAccount().getId()) // ID của account liên kết
                .fullName(profile.getFullName()) // Họ tên
                .avatarUrl(profile.getAvatar()) // URL ảnh đại diện
                .bio(profile.getBio()) // Thông tin giới thiệu
                .phone(profile.getPhone()) // Số điện thoại
                .build();
    }

}

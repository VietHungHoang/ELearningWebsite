package com.elearning.tutorservice.service;

import com.elearning.tutorservice.dto.response.UserInfoResponse;

import java.util.List;
import java.util.UUID;

public interface UserService {

    List<UserInfoResponse> getUsersByIds(List<UUID> userIds);

    UserInfoResponse getUserById(UUID userId);
}

package com.elearning.studentservice.service;

import com.elearning.studentservice.dto.response.UserInfoResponse;

import java.util.List;
import java.util.UUID;

public interface UserService {
    List<UserInfoResponse> getUsersByIds(List<UUID> userIds);
}

package com.elearning.classservice.service;

import com.elearning.classservice.dto.request.RescheduleRequestRequest;
import com.elearning.classservice.dto.response.RescheduleRequestResponse;

import java.util.List;
import java.util.UUID;

public interface RescheduleRequestService {
    void createForSession(UUID sessionId, UUID requesterId, RescheduleRequestRequest dto);

    List<RescheduleRequestResponse> getRequestsByUser(UUID userId, String userType);

    void acceptRequest(UUID requestId, UUID userId);

    void rejectRequest(UUID requestId, UUID userId);
}

package com.elearning.classservice.controller;

import com.elearning.classservice.dto.response.ApiResponse;
import com.elearning.classservice.dto.response.RescheduleRequestResponse;
import com.elearning.classservice.service.RescheduleRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/classes/reschedule-requests")
@RequiredArgsConstructor
public class RescheduleRequestController {

    private final RescheduleRequestService rescheduleRequestService;

    @GetMapping("/by-user")
    public ResponseEntity<ApiResponse<List<RescheduleRequestResponse>>> getRequestsByUser(
            @RequestParam String userType,
            @RequestHeader("X-User-Id") String userIdHeader) {
        UUID userId = UUID.fromString(userIdHeader);
        List<RescheduleRequestResponse> requests = rescheduleRequestService.getRequestsByUser(userId, userType);
        return ResponseEntity.ok(ApiResponse.success(requests, "Reschedule requests retrieved successfully"));
    }

    @PutMapping("/{requestId}/accept")
    public ResponseEntity<ApiResponse<Void>> acceptRequest(
            @PathVariable UUID requestId,
            @RequestHeader("X-User-Id") String userIdHeader) {
        UUID userId = UUID.fromString(userIdHeader);
        rescheduleRequestService.acceptRequest(requestId, userId);
        return ResponseEntity.ok(ApiResponse.success(null, "Reschedule request accepted successfully"));
    }

    @DeleteMapping("/{requestId}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectRequest(
            @PathVariable UUID requestId,
            @RequestHeader("X-User-Id") String userIdHeader) {
        UUID userId = UUID.fromString(userIdHeader);
        rescheduleRequestService.rejectRequest(requestId, userId);
        return ResponseEntity.ok(ApiResponse.success(null, "Reschedule request rejected successfully"));
    }
}
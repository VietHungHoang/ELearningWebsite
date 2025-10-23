package com.elearning.chat_service.controller;

import com.elearning.chat_service.dto.response.ApiResponse;
import com.elearning.chat_service.service.EnrollmentEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/internal/enrollments")
@RequiredArgsConstructor
public class EnrollmentEventController {
    private final EnrollmentEventService enrollmentEventService;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> handleEnrollment(
            @RequestParam String learnerId,
            @RequestParam String instructorId,
            @RequestParam String courseId) {
        enrollmentEventService.createConversationIfNotExists(learnerId, instructorId, courseId);
        return ResponseEntity.ok(ApiResponse.success(null, "Conversation created or already exists"));
    }
}

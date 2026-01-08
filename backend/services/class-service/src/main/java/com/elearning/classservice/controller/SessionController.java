package com.elearning.classservice.controller;

import com.elearning.classservice.dto.request.CheckSlotConflictsRequest;
import com.elearning.classservice.dto.request.CreateClassBookingRequest;
import com.elearning.classservice.dto.request.JoinSessionRequest;
import com.elearning.classservice.dto.response.ApiResponse;
import com.elearning.classservice.dto.response.CreateClassBookingResponse;
import com.elearning.classservice.dto.response.JoinSessionResponse;
import com.elearning.classservice.dto.response.ReviewEligibilityResponse;
import com.elearning.classservice.dto.response.SlotConflictResponse;
import com.elearning.classservice.dto.sessions.SessionResponse;
import com.elearning.classservice.service.ClassService;
import com.elearning.classservice.service.RescheduleRequestService;
import com.elearning.classservice.service.SessionService;
import com.elearning.classservice.dto.request.RescheduleRequestRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/classes/sessions")
@RequiredArgsConstructor
@Slf4j
public class SessionController {

    private final SessionService sessionService;
    private final ClassService classService;
    private final RescheduleRequestService rescheduleRequestService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<SessionResponse>>> getBookedSessionsForUser(
            @RequestHeader("X-User-Id") UUID userId,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate) {

        log.info("Request to get booked sessions for user {} from {} to {}", userId, startDate, endDate);
        List<SessionResponse> sessions = sessionService.getBookedSessionsForUser(userId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(sessions, "Booked sessions retrieved successfully"));
    }

    @PostMapping("/check-slot-conflicts")
    public ResponseEntity<ApiResponse<SlotConflictResponse>> checkSlotConflicts(
            @RequestHeader(value = "X-User-Id", required = false) UUID studentId,
            @RequestBody CheckSlotConflictsRequest request) {

        log.info("Checking slot conflicts for tutor {}, student {}, from {} to {}",
                request.getTutorId(), studentId, request.getStartDate(), request.getEndDate());
        SlotConflictResponse response = sessionService.checkSlotConflicts(studentId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Slot conflicts checked successfully"));
    }

    @GetMapping("/tutors/{tutorId}")
    public ResponseEntity<ApiResponse<List<SessionResponse>>> getSessionsForTutor(
            @PathVariable UUID tutorId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {

        log.info("Request to get sessions for tutor {} from {} to {}", tutorId, startDate, endDate);
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59, 999999999);
        List<SessionResponse> sessions = sessionService.getBookedSessions(tutorId, startDateTime, endDateTime);
        return ResponseEntity.ok(ApiResponse.success(sessions, "Sessions retrieved successfully"));
    }

    @GetMapping("/students/{studentId}")
    public ResponseEntity<ApiResponse<List<SessionResponse>>> getSessionsForStudent(
            @PathVariable UUID studentId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {

        log.info("Request to get sessions for student {} from {} to {}", studentId, startDate, endDate);
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59, 999999999);
        List<SessionResponse> sessions = sessionService.getBookedSessionsForStudent(studentId, startDateTime,
                endDateTime);
        return ResponseEntity.ok(ApiResponse.success(sessions, "Sessions retrieved successfully"));
    }

    @PostMapping("/bookings")
    public ResponseEntity<ApiResponse<CreateClassBookingResponse>> createClassBooking(
            @RequestBody CreateClassBookingRequest request) {

        log.info("Request to create class booking for student {} with tutor {}", request.getStudentId(),
                request.getTutorId());
        CreateClassBookingResponse response = classService.createClassBooking(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Class booking created successfully"));
    }

    @PostMapping("/{sessionId}/reschedule")
    public ResponseEntity<ApiResponse<Void>> requestSessionReschedule(
            @PathVariable UUID sessionId,
            @RequestHeader("X-User-Id") UUID userId,
            @RequestBody RescheduleRequestRequest request) {

        log.info("User {} requests reschedule for session {} -> newSchedule={}", userId, sessionId,
                request.getNewSchedule());
        rescheduleRequestService.createForSession(sessionId, userId, request);
        return ResponseEntity.status(201).body(ApiResponse.success(null, "Reschedule request created"));
    }
    /**
     * Student joins a session - marks attendance and returns meeting URL
     */
    @PostMapping("/{sessionId}/join")
    public ResponseEntity<ApiResponse<JoinSessionResponse>> joinSession(
            @PathVariable UUID sessionId,
            @RequestBody JoinSessionRequest request) {

        log.info("Student {} requesting to join session {}", request.getStudentId(), sessionId);
        
        try {
            JoinSessionResponse response = sessionService.joinSession(sessionId, UUID.fromString(request.getStudentId()));
            return ResponseEntity.ok(ApiResponse.success(response, "Successfully joined session"));
        } catch (Exception e) {
            log.error("Error joining session {}: {}", sessionId, e.getMessage(), e);
            return ResponseEntity.badRequest().body(ApiResponse.error(500, "Failed to join session: " + e.getMessage()));
        }
    }
    /**
     * Check if the current student is eligible to review a tutor
     * Eligibility: student has at least one session with the tutor
     */
    @GetMapping("/check-review-eligibility")
    public ResponseEntity<ApiResponse<ReviewEligibilityResponse>> checkReviewEligibility(
            @RequestHeader("X-User-Id") UUID studentId,
            @RequestParam UUID tutorId) {

        log.info("Checking review eligibility for student {} with tutor {}", studentId, tutorId);
        ReviewEligibilityResponse response = sessionService.checkReviewEligibility(studentId, tutorId);
        return ResponseEntity.ok(ApiResponse.success(response, "Eligibility checked successfully"));
    }
}
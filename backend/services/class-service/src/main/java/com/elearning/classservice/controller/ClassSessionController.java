package com.elearning.classservice.controller;

import com.elearning.classservice.dto.response.ApiResponse;
import com.elearning.classservice.dto.response.BookedSessionResponse;
import com.elearning.classservice.entity.enums.ClassType;
import com.elearning.classservice.service.SessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/classes/sessions")
@RequiredArgsConstructor
@Slf4j
public class ClassSessionController {

    private final SessionService sessionService;

    @GetMapping("/tutors/{tutorId}")
    public ResponseEntity<ApiResponse<List<BookedSessionResponse>>> getTutorBookedSessions(
            @PathVariable UUID tutorId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {

        log.info("Request to get booked sessions for tutor {} from {} to {}", tutorId, startDate, endDate);

        List<BookedSessionResponse> sessions = sessionService.getBookedSessions(tutorId, startDate, endDate);

        return ResponseEntity.ok(ApiResponse.success(sessions, "Booked sessions retrieved successfully"));
    }
}
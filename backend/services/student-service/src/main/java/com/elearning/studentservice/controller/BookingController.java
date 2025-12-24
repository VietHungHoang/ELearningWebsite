package com.elearning.studentservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.elearning.studentservice.dto.request.CreateBookingRequest;
import com.elearning.studentservice.dto.request.CreateBookingResponse;
import com.elearning.studentservice.dto.response.ApiResponse;
import com.elearning.studentservice.service.BookingService;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/classes/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<CreateBookingResponse>> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            @RequestHeader("X-User-Id") UUID studentId) {

        log.info("Creating booking for student: {}", studentId);
        CreateBookingResponse response = bookingService.createBooking(request, studentId);
        return ResponseEntity.ok(ApiResponse.success(response, "Booking created successfully"));
    }
}
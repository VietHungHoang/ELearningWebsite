package com.elearning.bookingservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.elearning.bookingservice.dto.request.CreateBookingRequest;
import com.elearning.bookingservice.dto.request.CreateBookingResponse;
import com.elearning.bookingservice.dto.response.ApiResponse;
import com.elearning.bookingservice.dto.response.BookingHistoryResponse;
import com.elearning.bookingservice.entity.BookingStatus;
import com.elearning.bookingservice.service.BookingService;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<CreateBookingResponse>> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            @RequestHeader("X-User-Id") UUID studentId) {

        log.info("Creating booking for student: {}", studentId);
        request.setStudentId(studentId);
        CreateBookingResponse response = bookingService.createBooking(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Booking created successfully"));
    }

    @GetMapping("/me/history")
    public ResponseEntity<ApiResponse<Page<BookingHistoryResponse>>> getBookingHistory(
            @RequestHeader("X-User-Id") UUID studentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String status) {

        log.info("Fetching booking history for student: {}, status: {}, page: {}, limit: {}",
                studentId, status, page, limit);

        BookingStatus bookingStatus = null;
        if (status != null && !status.isEmpty()) {
            try {
                bookingStatus = BookingStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("Invalid status value: {}", status);
            }
        }

        Pageable pageable = PageRequest.of(page, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<BookingHistoryResponse> history = bookingService.getBookingHistory(studentId, bookingStatus, pageable);

        return ResponseEntity.ok(ApiResponse.success(history, "Booking history retrieved successfully"));
    }
}
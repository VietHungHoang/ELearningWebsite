package com.elearning.bookingservice.service;

import com.elearning.bookingservice.dto.request.CreateBookingRequest;
import com.elearning.bookingservice.dto.request.CreateBookingResponse;
import com.elearning.bookingservice.dto.response.BookingHistoryResponse;
import com.elearning.bookingservice.entity.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface BookingService {

    CreateBookingResponse createBooking(CreateBookingRequest request);

    Page<BookingHistoryResponse> getBookingHistory(UUID studentId, BookingStatus status, Pageable pageable);
}
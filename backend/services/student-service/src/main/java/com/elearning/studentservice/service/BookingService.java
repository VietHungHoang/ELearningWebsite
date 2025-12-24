package com.elearning.studentservice.service;

import java.util.UUID;

import com.elearning.studentservice.dto.request.CreateBookingRequest;
import com.elearning.studentservice.dto.request.CreateBookingResponse;

public interface BookingService {

    CreateBookingResponse createBooking(CreateBookingRequest request, UUID studentId);
}
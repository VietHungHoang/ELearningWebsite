package com.elearning.bookingservice.service;

import com.elearning.bookingservice.dto.request.CreateBookingRequest;
import com.elearning.bookingservice.dto.request.CreateBookingResponse;

public interface BookingService {

    CreateBookingResponse createBooking(CreateBookingRequest request);
}
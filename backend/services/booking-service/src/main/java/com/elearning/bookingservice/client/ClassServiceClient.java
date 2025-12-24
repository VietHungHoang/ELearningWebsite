package com.elearning.bookingservice.client;

import com.elearning.bookingservice.dto.request.CreateClassBookingRequest;
import com.elearning.bookingservice.dto.response.CreateClassBookingResponse;

public interface ClassServiceClient {

    CreateClassBookingResponse createClassBooking(CreateClassBookingRequest request);
}
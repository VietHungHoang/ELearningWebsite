package com.elearning.studentservice.client;

import com.elearning.studentservice.dto.request.CreateClassBookingRequest;
import com.elearning.studentservice.dto.response.CreateClassBookingResponse;

public interface ClassServiceClient {

    CreateClassBookingResponse createClassBooking(CreateClassBookingRequest request);
}
package com.elearning.bookingservice.client;

import com.elearning.bookingservice.dto.request.CreatePaymentRequest;
import com.elearning.bookingservice.dto.response.CreatePaymentResponse;

public interface PaymentServiceClient {

    CreatePaymentResponse createPayment(CreatePaymentRequest request);
}
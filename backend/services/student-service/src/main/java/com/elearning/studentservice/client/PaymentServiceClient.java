package com.elearning.studentservice.client;

import com.elearning.studentservice.dto.request.CreatePaymentRequest;
import com.elearning.studentservice.dto.response.CreatePaymentResponse;

public interface PaymentServiceClient {

    CreatePaymentResponse createPayment(CreatePaymentRequest request);
}
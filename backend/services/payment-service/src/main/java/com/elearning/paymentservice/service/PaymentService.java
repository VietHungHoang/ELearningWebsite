package com.elearning.paymentservice.service;

import com.elearning.paymentservice.dto.request.InitiatePaymentRequest;
import com.elearning.paymentservice.dto.response.InitiatePaymentResponse;

public interface PaymentService {

    InitiatePaymentResponse initiatePayment(InitiatePaymentRequest request);
}
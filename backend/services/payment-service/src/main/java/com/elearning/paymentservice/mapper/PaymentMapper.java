package com.elearning.paymentservice.mapper;

import com.elearning.paymentservice.dto.request.InitiatePaymentRequest;
import com.elearning.paymentservice.enums.PaymentStatus;
import com.elearning.paymentservice.entity.PaymentTransaction;

public class PaymentMapper {

    public static PaymentTransaction toEntity(InitiatePaymentRequest request) {
        return PaymentTransaction.builder()
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .provider(request.getPaymentProvider())
                .status(PaymentStatus.PENDING)
                .build();
    }
}
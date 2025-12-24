package com.elearning.tutorservice.dto.response;

import com.elearning.tutorservice.entity.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentMethodResponse {
    private PaymentMethod paymentMethod;
    private String paymentMethodData;
}
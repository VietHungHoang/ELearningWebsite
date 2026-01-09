package com.elearning.bookingservice.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentSuccessNotificationEvent {
    private UUID bookingId;
    private UUID studentId;
    private String studentEmail;
    private String studentName;
    private BigDecimal amount;
    private String currency;
    private String tutorName;
    private String classTitle;
}


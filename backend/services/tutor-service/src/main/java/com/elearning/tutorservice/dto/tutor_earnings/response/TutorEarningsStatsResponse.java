package com.elearning.tutorservice.dto.tutor_earnings.response;

import com.elearning.tutorservice.dto.response.PaymentMethodResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorEarningsStatsResponse {
    private BigDecimal availableBalance;
    private BigDecimal pendingBalance;
    private PaymentMethodResponse paymentMethod;
    private BigDecimal totalEarned;
}
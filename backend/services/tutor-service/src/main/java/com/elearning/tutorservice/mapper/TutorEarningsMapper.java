package com.elearning.tutorservice.mapper;

import com.elearning.tutorservice.dto.tutor_earnings.response.TutorEarningsResponse;
import com.elearning.tutorservice.entity.TutorEarnings;
import org.springframework.stereotype.Component;

@Component
public class TutorEarningsMapper {

    public TutorEarningsResponse toResponse(TutorEarnings earnings) {
        return TutorEarningsResponse.builder()
                .id(earnings.getId())
                .sessionId(earnings.getSessionId())
                .amount(earnings.getAmount())
                .className(earnings.getClassName())
                .status(earnings.getStatus().name())
                .paidAt(earnings.getPaidAt())
                .paymentId(earnings.getPaymentId())
                .notes(earnings.getNotes())
                .createdAt(earnings.getCreatedAt())
                .updatedAt(earnings.getUpdatedAt())
                .build();
    }
}
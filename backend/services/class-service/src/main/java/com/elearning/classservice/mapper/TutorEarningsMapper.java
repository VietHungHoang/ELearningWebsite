package com.elearning.classservice.mapper;

import com.elearning.classservice.dto.response.TutorEarningsResponse;
import com.elearning.classservice.entity.TutorEarnings;
import org.springframework.stereotype.Component;

@Component
public class TutorEarningsMapper {

    public TutorEarningsResponse toResponse(TutorEarnings earnings) {
        return TutorEarningsResponse.builder()
                .id(earnings.getId())
                .sessionId(earnings.getSession().getId())
                .amount(earnings.getAmount())
                .status(earnings.getStatus().name())
                .paidAt(earnings.getPaidAt())
                .paymentId(earnings.getPaymentId())
                .notes(earnings.getNotes())
                .createdAt(earnings.getCreatedAt())
                .updatedAt(earnings.getUpdatedAt())
                .build();
    }
}
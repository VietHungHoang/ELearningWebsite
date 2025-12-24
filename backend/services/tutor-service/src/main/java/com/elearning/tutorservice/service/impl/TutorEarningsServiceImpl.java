package com.elearning.tutorservice.service.impl;

import com.elearning.tutorservice.dto.response.PaymentMethodResponse;
import com.elearning.tutorservice.dto.tutor_earnings.response.TutorEarningsResponse;
import com.elearning.tutorservice.dto.tutor_earnings.response.TutorEarningsStatsResponse;
import com.elearning.tutorservice.entity.TutorEarnings;
import com.elearning.tutorservice.entity.enums.ClassType;
import com.elearning.tutorservice.mapper.TutorEarningsMapper;
import com.elearning.tutorservice.repository.TutorEarningsRepository;
import com.elearning.tutorservice.repository.TutorRepository;
import com.elearning.tutorservice.service.TutorEarningsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TutorEarningsServiceImpl implements TutorEarningsService {

    private final TutorEarningsRepository tutorEarningsRepository;
    private final TutorEarningsMapper tutorEarningsMapper;
    private final TutorRepository tutorRepository; // Injecting TutorRepository

    @Override
    @Transactional(readOnly = true)
    public Page<TutorEarningsResponse> getEarningsByTutorId(UUID tutorId, ClassType classType, Pageable pageable) {
        Page<TutorEarnings> earningsPage;
        if (classType != null) {
            earningsPage = tutorEarningsRepository.findByTutorIdAndClassType(tutorId, classType, pageable);
        } else {
            earningsPage = tutorEarningsRepository.findByTutorId(tutorId, pageable);
        }
        return earningsPage.map(tutorEarningsMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public TutorEarningsStatsResponse getEarningsStatsByTutorId(UUID tutorId) {
        BigDecimal availableBalance = tutorEarningsRepository.getAvailableBalanceByTutor(tutorId);
        BigDecimal pendingBalance = tutorEarningsRepository.getPendingBalanceByTutor(tutorId);
        BigDecimal totalEarned = tutorEarningsRepository.getTotalEarnedByTutor(tutorId);

        var tutor = tutorRepository.findById(tutorId).orElseThrow(() -> new RuntimeException("Tutor not found"));
        PaymentMethodResponse paymentMethod = null;
        if (tutor.getPaymentMethod() != null) {
            paymentMethod = PaymentMethodResponse.builder()
                    .paymentMethod(tutor.getPaymentMethod())
                    .paymentMethodData(tutor.getPaymentMethodData())
                    .build();
        }

        return TutorEarningsStatsResponse.builder()
                .availableBalance(availableBalance)
                .pendingBalance(pendingBalance)
                .paymentMethod(paymentMethod)
                .totalEarned(totalEarned)
                .build();
    }
}
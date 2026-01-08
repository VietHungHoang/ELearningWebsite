package com.elearning.tutorservice.service.impl;

import com.elearning.tutorservice.dto.event.SessionStartedEvent;
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
import java.time.Duration;
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
        log.info("=== GET EARNINGS BY TUTOR ID ===");
        log.info("Tutor ID: {}", tutorId);
        log.info("Class Type: {}", classType);
        log.info("Page: {}, Size: {}", pageable.getPageNumber(), pageable.getPageSize());
        
        // Kiểm tra tổng số earnings của tutor này
        long totalCount = tutorEarningsRepository.count();
        log.info("Total earnings in DB: {}", totalCount);
        
        Page<TutorEarnings> earningsPage;
        if (classType != null) {
            earningsPage = tutorEarningsRepository.findByTutorIdAndClassType(tutorId, classType, pageable);
            log.info("Query with classType - Found {} earnings", earningsPage.getTotalElements());
        } else {
            earningsPage = tutorEarningsRepository.findByTutorId(tutorId, pageable);
            log.info("Query without classType - Found {} earnings", earningsPage.getTotalElements());
        }
        
        if (earningsPage.isEmpty()) {
            log.warn("No earnings found for tutor: {}", tutorId);
        } else {
            log.info("Returning {} earnings (page {}/{})", 
                earningsPage.getNumberOfElements(), 
                earningsPage.getNumber() + 1, 
                earningsPage.getTotalPages());
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

    @Override
    @Transactional
    public void createEarningsFromSessionStart(SessionStartedEvent event) {
        log.info("Creating earnings record for session {} started by tutor {}", event.getSessionId(), event.getTutorId());

        try {
            // Calculate session duration in hours
            long durationMinutes = Duration.between(event.getStartTime(), event.getEndTime()).toMinutes();
            double hours = durationMinutes / 60.0;

            // Calculate earnings amount
            BigDecimal amount = event.getPricePerHour().multiply(BigDecimal.valueOf(hours));

            // Map classType string to ClassType enum
            ClassType classType = ClassType.valueOf(event.getClassType());

            // Create TutorEarnings record
            TutorEarnings earnings = TutorEarnings.builder()
                    .tutorId(event.getTutorId())
                    .sessionId(event.getSessionId())
                    .amount(amount)
                    .classType(classType)
                    .status(TutorEarnings.EarningsStatus.PENDING)
                    .notes("Earnings from session: " + (event.getSessionTitle() != null ? event.getSessionTitle() : event.getSessionId()))
                    .build();

            tutorEarningsRepository.save(earnings);

            log.info("Successfully created earnings record for session {}: amount={}, duration={}h", 
                    event.getSessionId(), amount, hours);
        } catch (Exception e) {
            log.error("Failed to create earnings record for session {}: {}", event.getSessionId(), e.getMessage(), e);
            throw new RuntimeException("Failed to create earnings record", e);
        }
    }
}